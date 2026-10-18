import assert from 'node:assert/strict';
import test from 'node:test';
import {taoSentiment, sentimentLabel} from '../app/lib/tao-sentiment.ts';
const rows = (change=0,liquidity=0,acceleration=1) => Array.from({length:128},(_,i)=>({netuid:i+1,time:'2026-10-18T22:00:00Z',change_1h:change,liquidity_change_1h:liquidity,volume_1h_tao:100,volume_acceleration_1h:acceleration}));
test('flat market is neutral and active selloff/buying are symmetric',()=>{
 assert.equal(taoSentiment(rows()).score,50);
 assert.equal(taoSentiment(rows(5,5,2)).score,100);
 assert.equal(taoSentiment(rows(-5,-5,2)).score,0);
 // Increasing volume during a selloff must not be scored as greed.
 assert.ok(taoSentiment(rows(-2,-1,2)).score < taoSentiment(rows(-2,-1,1)).score);
});
test('missing and lagging data never become false zero inputs',()=>{
 assert.equal(taoSentiment(rows().slice(0,10)),null);
 let r=rows();for(let i=0;i<26;i++)r[i].change_1h=null;
 assert.equal(taoSentiment(r),null);
 r=rows();for(let i=0;i<26;i++)r[i].time='2026-10-18T21:00:00Z';
 assert.equal(taoSentiment(r),null);
 r=rows();r[0].change_1h='';assert.equal(taoSentiment(r).count,127);
 r=rows();r[0].liquidity_change_1h=-100;assert.equal(taoSentiment(r).count,127);
});
test('outliers are bounded and labels cover all thresholds',()=>{
 let r=rows();r[0].change_1h=1000000;assert.equal(taoSentiment(r).components.momentum,50);
 for(const [n,label] of [[0,'Extreme fear'],[24,'Extreme fear'],[25,'Fear'],[44,'Fear'],[45,'Neutral'],[55,'Neutral'],[56,'Greed'],[75,'Greed'],[76,'Extreme greed'],[100,'Extreme greed']])assert.equal(sentimentLabel(n),label);
});

test('daily score uses only daily inputs and never falls back to hourly data',()=>{
 const r=rows(-5,-5,2).map(row=>({...row,change_24h:5,liquidity_change_24h:5,volume_24h_tao:2400,volume_acceleration_24h:2}));
 assert.equal(taoSentiment(r,'1h').score,0);
 assert.equal(taoSentiment(r,'24h').score,100);
 assert.equal(taoSentiment(rows(),'24h'),null);
 for(let i=0;i<26;i++)r[i].volume_acceleration_24h=null;
 assert.equal(taoSentiment(r,'24h'),null);
});
