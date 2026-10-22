import test from 'node:test';
import assert from 'node:assert/strict';
import { cachedChart } from '../app/lib/chart-cache.ts';
const payload={data:[['2026-10-01',1,2,1,2,0]],method:'taostats-alpha'};
const makeStore = (saved) => ({value:saved,async get(){return this.value;},async set(_key,value){this.value=value;}});
test('concurrent cold readers share one chart load and keys remain isolated',async()=>{
 let calls=0;const store=makeStore();const load=async()=>{calls++;await new Promise(r=>setTimeout(r,5));return payload;};
 const results=await Promise.all(Array.from({length:20},()=>cachedChart('cold-51-daily',store,load,()=>{})));
 assert.equal(calls,1);assert.equal(results[0].historyStale,false);assert.deepEqual(results[0].data,payload.data);
 await cachedChart('cold-64-daily',makeStore(),load,()=>{});assert.equal(calls,2);
});
test('stale history returns immediately, failed refresh retains it and applies cooldown',async()=>{
 const old={payload,checkedAt:Date.now()-120000};const store=makeStore(old);const work=[];let calls=0;
 const load=async()=>{calls++;throw new Error('provider 429');};
 const result=await cachedChart('stale-51-weekly',store,load,fn=>work.push(fn));
 assert.equal(result.historyStale,true);assert.equal(calls,0);assert.equal(work.length,1);
 await work[0]();assert.equal(calls,1);assert.equal(store.value.checkedAt,old.checkedAt);assert.deepEqual(store.value.payload,payload);
 await cachedChart('stale-51-weekly',store,load,fn=>work.push(fn));assert.equal(work.length,1);
});
test('an empty provider response cannot erase known candles; historical no-data can mark its boundary',async()=>{
 const store=makeStore({payload,checkedAt:Date.now()-120000});const work=[];
 await cachedChart('empty-replacement',store,async()=>({data:[],done:true}),fn=>work.push(fn));await work[0]();
 assert.deepEqual(store.value.payload,payload);
 const boundary=await cachedChart('empty-older-page',makeStore(),async()=>({data:[],done:true}),()=>{});assert.equal(boundary.done,true);
});
test('cache failure does not discard a successful load and future-dated cache is rejected',async()=>{
 let calls=0;const store={async get(){throw new Error('cache outage');},async set(){throw new Error('cache outage');}};
 await cachedChart('cache-outage',store,async()=>{calls++;return payload;},()=>{});
 await cachedChart('cache-outage',store,async()=>{calls++;return payload;},()=>{});assert.equal(calls,1);
 const future=makeStore({payload,checkedAt:Date.now()+86400000});
 await cachedChart('future-cache',future,async()=>{calls++;return payload;},()=>{});assert.equal(calls,2);
});
