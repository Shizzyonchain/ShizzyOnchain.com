
import { AINewsItem } from '../types.ts';

/**
 * SHIZZY NEWS PIPELINE v3.0 - FEEDLY NORMALIZATION LAYER
 * Follows strict ingestion rules:
 * 1. Single upstream (Feedly Stream)
 * 2. Local snapshot persistence (No blocking loads)
 * 3. Canonical link preservation
 */

const FEEDLY_BASE = 'https://api.feedly.com/v3';
// Environment variables injected via build process or platform
const FEEDLY_TOKEN = process.env.FEEDLY_TOKEN || '';
const FEEDLY_STREAM_ID = process.env.FEEDLY_STREAM_ID || '';
const DEFAULT_IMAGE = process.env.DEFAULT_NEWS_IMAGE_URL || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop';

// DB Simulation Keys (LocalStorage)
const DB_ITEMS_KEY = 'news_items_v2';
const DB_SNAPSHOTS_KEY = 'news_snapshots_v2';

interface NewsSnapshot {
  id: string;
  created_at: number;
  last_success_at: number;
  item_ids: string[];
  status: 'valid' | 'failed';
  failure_reason?: string;
}

export const newsService = {
  _isSyncing: false,

  /**
   * Home page accessor. 
   * Reads ONLY the latest valid snapshot. Zero network delay.
   */
  getLatestSnapshotItems(): { items: AINewsItem[], lastUpdate: number } {
    const snapshots = this._getSnapshots();
    const latest = snapshots.find(s => s.status === 'valid');
    
    if (!latest) return { items: [], lastUpdate: 0 };

    const allItems = this._getItems();
    const snapshotItems = latest.item_ids
      .map(id => allItems[id])
      .filter(Boolean);

    return { 
      items: snapshotItems, 
      lastUpdate: latest.last_success_at 
    };
  },

  /**
   * Main sync trigger. 
   * Runs in background, updates snapshots on success.
   */
  async sync(force = false): Promise<void> {
    const now = Date.now();
    const lastSnapshot = this._getSnapshots().find(s => s.status === 'valid');
    
    // Ingestion frequency: 5 minutes
    if (!force && lastSnapshot && (now - lastSnapshot.last_success_at < 300000)) {
      return;
    }

    if (this._isSyncing) return;
    this._isSyncing = true;

    try {
      const newerThan = lastSnapshot ? lastSnapshot.last_success_at : undefined;
      const feedlyData = await this._fetchFeedsFromFeedly(newerThan);
      
      if (!feedlyData || !feedlyData.items) {
        throw new Error('Empty payload from Feedly');
      }

      const normalizedItems = this._normalizeFeedlyItems(feedlyData.items);
      
      // Update DB Items (Upsert)
      const currentItems = this._getItems();
      normalizedItems.forEach(item => {
        currentItems[item.id] = item;
      });
      this._saveItems(currentItems);

      // Create New Snapshot (Top 30 newest)
      // Fix: Explicitly cast to AINewsItem[] to avoid property access errors on 'unknown'
      const itemsList = Object.values(currentItems) as AINewsItem[];
      const snapshotItemIds = itemsList
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
        .slice(0, 30)
        .map(i => i.id);

      const newSnapshot: NewsSnapshot = {
        id: `snap_${Date.now()}`,
        created_at: Date.now(),
        last_success_at: Date.now(),
        item_ids: snapshotItemIds,
        status: 'valid'
      };

      this._saveSnapshot(newSnapshot);
    } catch (error) {
      console.error('[Ingestion Job Failed]:', error);
      const failedSnapshot: NewsSnapshot = {
        id: `fail_${Date.now()}`,
        created_at: Date.now(),
        last_success_at: lastSnapshot?.last_success_at || 0,
        item_ids: lastSnapshot?.item_ids || [],
        status: 'failed',
        failure_reason: error instanceof Error ? error.message : 'Unknown transport error'
      };
      this._saveSnapshot(failedSnapshot);
    } finally {
      this._isSyncing = false;
    }
  },

  // Internal helper methods (removed invalid 'private' modifiers)

  async _fetchFeedsFromFeedly(newerThan?: number): Promise<any> {
    if (!FEEDLY_TOKEN || !FEEDLY_STREAM_ID) {
      throw new Error('Missing environment configuration: FEEDLY_TOKEN or FEEDLY_STREAM_ID');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const url = new URL(`${FEEDLY_BASE}/streams/contents`);
    url.searchParams.append('streamId', FEEDLY_STREAM_ID);
    url.searchParams.append('count', '100');
    if (newerThan) url.searchParams.append('newerThan', newerThan.toString());

    try {
      const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${FEEDLY_TOKEN}` },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 429) throw new Error('Feedly rate limited (429)');
      if (!response.ok) throw new Error(`Feedly API Error: ${response.status}`);

      return await response.json();
    } catch (e) {
      clearTimeout(timeoutId);
      throw e;
    }
  },

  _normalizeFeedlyItems(items: any[]): AINewsItem[] {
    const fourteenDaysAgo = Date.now() - (14 * 24 * 60 * 60 * 1000);
    
    return items
      .map(item => {
        // 1. Link Resolution (Canonical > Alternate)
        const url = item.canonicalUrl || (item.alternate && item.alternate[0]?.href);
        if (!url || !url.startsWith('http')) return null;

        // 2. Source Resolution
        const source = item.origin?.title || this._extractDomain(item.originId) || 'AI Stream';

        // 3. Image Resolution
        const image_url = item.visual?.url || DEFAULT_IMAGE;

        // 4. Excerpt Cleaning
        const excerpt = item.summary?.content 
          ? this._stripHtml(item.summary.content).slice(0, 240)
          : '';

        const published_at = item.published ? new Date(item.published).toISOString() : new Date().toISOString();

        if (new Date(published_at).getTime() < fourteenDaysAgo) return null;

        return {
          id: this._generateStableId(url),
          title: item.title || 'Untitled Discovery',
          url,
          source,
          published_at,
          image_url,
          excerpt,
          tags: ['ai']
        };
      })
      .filter((i): i is AINewsItem => i !== null);
  },

  _extractDomain(originId: string): string {
    if (!originId) return '';
    try {
      const parts = originId.split('/');
      const domain = parts[parts.length - 1];
      return domain.replace('feed/', '');
    } catch { return ''; }
  },

  _stripHtml(html: string): string {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  },

  _generateStableId(url: string): string {
    let hash = 0;
    const str = url.split('#')[0].split('?')[0];
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  },

  // Storage Accessors (Removed invalid 'private' modifiers)
  _getItems(): Record<string, AINewsItem> {
    const raw = localStorage.getItem(DB_ITEMS_KEY);
    return raw ? JSON.parse(raw) : {};
  },

  _saveItems(items: Record<string, AINewsItem>) {
    localStorage.setItem(DB_ITEMS_KEY, JSON.stringify(items));
  },

  _getSnapshots(): NewsSnapshot[] {
    const raw = localStorage.getItem(DB_SNAPSHOTS_KEY);
    return raw ? JSON.parse(raw) : [];
  },

  _saveSnapshot(snapshot: NewsSnapshot) {
    const snapshots = this._getSnapshots();
    snapshots.unshift(snapshot);
    // Keep last 10 snapshots for debugging/fallback
    localStorage.setItem(DB_SNAPSHOTS_KEY, JSON.stringify(snapshots.slice(0, 10)));
  }
};
