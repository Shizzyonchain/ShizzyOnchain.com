
import { AINewsItem } from '../types.ts';

/**
 * SHIZZY CRYPTO NEWS PIPELINE v1.1
 * High-signal crypto market intelligence and breaking news.
 */

const CRYPTO_CURATED_SIGNALS: AINewsItem[] = [
  {
    id: 'panic-selling-ai-macro',
    title: 'Markets Are Panic Selling on AI Uncertainty While Macro Tries to Calm Down',
    url: 'https://x.com/ShizzyUnchained',
    source: 'Shizzy Unchained',
    published_at: '2026-02-14T09:00:00Z',
    image_url: 'https://i.postimg.cc/nzN63nTh/E651E8D2-7099-44EE-A415-E5365E77D3F6.png',
    excerpt: `Markets are in that mode where nobody wants to be the last person holding risk. It is not even always “bearish,” it is more like a constant flinch. Something feels off, so people cut first and ask questions later. That is what panic selling looks like when it is driven by uncertainty instead of a single obvious catalyst.

And right now, AI is the uncertainty.

For a while, AI was this clean story. New cycle, new productivity, bigger margins, everyone wins. Now it is turning into a different story, especially for SaaS and anything built on a subscription seat model. The market is starting to realize that a lot of software value is basically “organized work.” If agents can do the work, or even just shrink the work, then the question becomes: what are customers actually paying for.

That question is enough to spook people. Because you cannot model it cleanly. It is not like earnings missed by 3 percent. It is a structural shift risk. Investors hear “agents” and immediately start thinking about pricing power compression, churn, and companies getting unbundled by a tool that costs a fraction of the monthly seat price.

So what happens. People sell the whole basket.

You can see it when the move is broad instead of surgical. Instead of money rotating from one software name to another, it just exits. Instead of “this company will win AI,” it becomes “I do not know who wins AI, so I will not pretend.” That is how you end up with the kind of sell off that feels emotional.

Now here is the weird part. On the macro side, we are actually getting more clarity than we had before.

A new Fed direction, less of that constant guessing game vibe, markets feel like they can at least map the range of outcomes a little better. In that sense, macro is moving toward certainty, or at least toward something you can price without feeling stupid.

But it is still the Fed. It is still a committee. The board still votes. Jerome Powell is still on that board. So the certainty is never total. It is conditional. One inflation print, one labor surprise, one financial stability event and suddenly the tone changes again. That is the thing markets forget when they get too comfortable. It can flip.

So you get this mashup that is making people nervous. Macro is trying to settle, but AI is shaking the ground under business models. And that combo creates this constant “I do not feel safe” energy in the tape.

When that happens, correlations go up. Stuff that normally behaves differently starts moving together. Crypto gets hit. Growth gets hit. Sometimes even things that are supposed to hedge get dragged at first, because the first move in panic is not “find the perfect hedge.” The first move is “raise cash.”

Then comes the second move. Hide.

That is where gold and silver start getting attention again. Not because they are suddenly exciting, but because they are simple. They do not need a narrative update every day. They do not need a product roadmap. They are just places people run when they feel like the future is getting harder to price.

And that is the key. This is not a market that is pricing fundamentals cleanly. This is a market pricing uncertainty first.

Until AI uncertainty settles into something people can understand, and until the Fed path feels steady enough that surprises do not feel like landmines, you are going to keep getting these moves that look bigger than they “should” be. That is what uncertainty does. It makes everything feel fragile.

So yeah, nobody can honestly breathe. Not because the game is over. Because the rules are changing mid game.`,
    tags: ['AI Uncertainty', 'Macro', 'Market Analysis', 'Panic Selling']
  },
  {
    id: 'binance-cease-desist',
    title: 'Binance Sends Cease-and-Desist Over Insolvency Claims as Tensions Spill Onto X',
    url: 'https://x.com/ShizzyUnchained',
    source: 'Market Intelligence',
    published_at: '2026-02-04T12:00:00Z',
    image_url: 'https://i.postimg.cc/N01jwP9R/IMG-3329.jpg',
    excerpt: `A letter circulating online today is adding fuel to an already tense moment in crypto. Binance issued a formal cease-and-desist notice to an X user, accusing them of spreading false and defamatory claims about the exchange’s financial health.

The letter, dated February 4, 2026, alleges that a post published the day prior claimed Binance was insolvent and suggested the situation was worse than the collapse of FTX. Binance flatly denies those assertions, calling them baseless, malicious, and legally defamatory.

According to the notice, Binance is demanding three things immediately: deletion of the original post and any related content, a public retraction acknowledging the claims were unsubstantiated, and an end to any further disparaging statements about the company. The deadline given is the same day, with the letter warning that failure to comply could result in legal action, including damages.

What stands out is the tone. This is not a vague PR pushback. It is a direct legal threat, explicitly stating that Binance is monitoring the account and has preserved evidence. That level of language suggests the company wants to draw a hard line around insolvency rumors, especially in a market still sensitive to anything resembling a bank run narrative.

Context matters here. Crypto markets remain shaped by the memory of sudden failures, and words like “insolvent” carry real weight. Whether or not the original post was opinion, exaggeration, or something else entirely, Binance is clearly signaling that it will not let comparisons to FTX go unanswered.

For now, the situation is a reminder of how fast social media commentary can escalate into legal territory in this industry. In a space built on transparency but haunted by past collapses, accusations travel fast and consequences can follow just as quickly.`,
    tags: ['Binance', 'Regulation', 'Market FUD', 'Exchanges']
  }
];

export const cryptoNewsService = {
  getLatestItems(): { items: AINewsItem[], lastUpdate: number } {
    return { 
      items: CRYPTO_CURATED_SIGNALS, 
      lastUpdate: Date.now()
    };
  }
};
