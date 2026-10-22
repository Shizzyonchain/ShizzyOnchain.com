import test from 'node:test';
import assert from 'node:assert/strict';
import {quoteFresh,quoteUsable} from '../app/lib/fx-price.ts';
test('USD freshness and usability expire independently of chain status',()=>{
 const now=Date.now(),quote={usd:300,updatedAt:Math.floor(now/1000)-30,source:'coinbase'};
 assert.equal(quoteFresh(quote,now),true);assert.equal(quoteFresh({...quote,stale:true},now),false);
 const delayed={...quote,updatedAt:Math.floor(now/1000)-240};assert.equal(quoteFresh(delayed,now),false);assert.equal(quoteUsable(delayed,now),true);
 assert.equal(quoteUsable({...quote,updatedAt:Math.floor(now/1000)-901},now),false);
 assert.equal(quoteUsable({...quote,updatedAt:Math.floor(now/1000)+86400},now),false);
 assert.equal(quoteUsable({...quote,usd:0},now),false);assert.equal(quoteUsable(null,now),false);
});
