import assert from 'node:assert/strict';
import test from 'node:test';
import { consumeRequest, responseCoalescer, concurrencyGate } from '../app/lib/request-protection.ts';

test('limits isolate clients and endpoint groups, then recover at the window boundary', () => {
 const state = new Map();
 assert.equal(consumeRequest('wallet:a', 2, 0, state), 0);
 assert.equal(consumeRequest('wallet:a', 2, 1, state), 0);
 assert.equal(consumeRequest('wallet:a', 2, 2, state), 60);
 assert.equal(consumeRequest('wallet:b', 2, 2, state), 0);
 assert.equal(consumeRequest('research:a', 2, 2, state), 0);
 assert.equal(consumeRequest('wallet:a', 2, 60_000, state), 0);
});
test('a full client map cannot erase active limits', () => {
 const state = new Map(Array.from({length:4096},(_,i)=>[String(i),{count:1,end:60_000}]));
 assert.equal(consumeRequest('new', 2, 0, state), 60);
 assert.equal(state.size,4096);
 assert.equal(consumeRequest('new', 2, 60_000, state),0);
});
test('concurrent identical history requests share one load and receive independent bodies', async () => {
 const load = responseCoalescer(); let calls=0, release;
 const gate=new Promise(resolve=>release=resolve);
 const source=async()=>{calls++;await gate;return Response.json({rows:[1]});};
 const a=load('wallet:transfers:1',source,300_000),b=load('wallet:transfers:1',source,300_000);
 release();const responses=await Promise.all([a,b]);
 assert.deepEqual(await responses[0].json(),{rows:[1]});assert.deepEqual(await responses[1].json(),{rows:[1]});
 assert.equal(calls,1);await load('wallet:transfers:1',source,300_000);assert.equal(calls,1);
 await load('other:transactions:1',source,300_000);assert.equal(calls,2);
});
test('history concurrency is bounded, cached reads still work and rejected loads release slots', async () => {
 const load=responseCoalescer(2,1);let release;
 await load('cached',async()=>Response.json({ok:true}),300_000);
 const slow=load('slow',()=>new Promise(resolve=>release=()=>resolve(Response.json({ok:true}))),300_000);
 assert.equal((await load('new',async()=>Response.json({}),300_000)).status,503);
 assert.equal((await load('cached',async()=>{throw Error('cache missed');},300_000)).status,200);
 release();await slow;
 await assert.rejects(load('bad',async()=>{throw Error('provider failed');},300_000));
 assert.equal((await load('new',async()=>Response.json({}),300_000)).status,200);
});
test('provider failures are briefly shared, not retried for every simultaneous visitor', async () => {
 const load=responseCoalescer();let calls=0;
 const source=async()=>{calls++;return Response.json({error:'quota'}, {status:429,headers:{'Retry-After':'60'}});};
 await load('quota',source,300_000);const result=await load('quota',source,300_000);
 assert.equal(calls,1);assert.equal(result.status,429);assert.equal(result.headers.get('Retry-After'),'60');
});
test('wallet admission limits concurrency and releases capacity after exceptions', async () => {
 const admit=concurrencyGate(1);let release;
 const first=admit(()=>new Promise(resolve=>release=()=>resolve(Response.json({job:'a'}))));
 assert.equal((await admit(async()=>Response.json({job:'b'}))).status,503);release();await first;
 await assert.rejects(admit(async()=>{throw Error('offline');}));
 assert.equal((await admit(async()=>Response.json({job:'c'}))).status,200);
});
