import assert from 'node:assert/strict';
import test from 'node:test';
import {taoSentiment, assessTaoSentiment, sentimentLabel} from '../app/lib/tao-sentiment.ts';
const rows = (change=0,liquidity=0,acceleration=1) => Array.from({length:128},(_,i)=>({netuid:i+1,time:new Date().toISOString(),change_1h:change,liquidity_change_1h:liquidity,volume_1h_tao:100,volume_acceleration_1h:acceleration}));
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

test('quiet subnets retain coverage without fabricating missing comparisons',()=>{
 const r=rows();
 for(let i=0;i<33;i++){r[i].volume_1h_tao=0;r[i].volume_acceleration_1h=0;}
 const result=taoSentiment(r);
 assert.equal(result.count,128);assert.equal(result.score,50);
 for(let i=0;i<33;i++)r[i].volume_acceleration_1h=null;
 assert.equal(taoSentiment(r).count,128);assert.equal(taoSentiment(r).score,50);
 for(let i=0;i<33;i++)r[i].volume_acceleration_1h=-1;
 assert.equal(taoSentiment(r),null);
});

test('missing ratios stay out of directional volume without discarding valid price observations',()=>{
 const r=rows();
 for(let i=0;i<45;i++){r[i].volume_acceleration_1h=null;r[i].volume_1h_tao=i<30?0:1;}
 assert.equal(taoSentiment(r).count,128);
 assert.equal(taoSentiment(r).score,50);
 for(let i=0;i<45;i++)r[i].volume_1h_tao=1;
 assert.ok(taoSentiment(r).volumeCoverage > 0.99);
 for(let i=0;i<45;i++)r[i].volume_1h_tao=100;
 assert.equal(taoSentiment(r),null);
});
test('future timestamps cannot poison current coverage, stale or duplicate rosters cannot produce a live score',()=>{
 const r=rows();r[0].time=new Date(Date.now()+86400000).toISOString();
 assert.equal(taoSentiment(r).count,127);
 assert.equal(taoSentiment(rows().map(row=>({...row,time:new Date(Date.now()-240000).toISOString()}))),null);
 const duplicate=rows();duplicate[0].netuid=duplicate[1].netuid;assert.equal(taoSentiment(duplicate),null);
});

test('October 22 recurrence: many small missing volume baselines cannot disable valid market components',()=>{
 const r=rows(1,0,2);
 for(let i=0;i<36;i++){r[i].volume_acceleration_1h=null;r[i].volume_1h_tao=i===0?0:5;}
 const reading=taoSentiment(r);
 assert.equal(reading.count,128);
 assert.equal(reading.components.breadth,100);
 assert.ok(reading.volumeCoverage > 0.97);
 assert.ok(Number.isFinite(reading.score));
 // One missing comparison carrying most trading activity must still block the score.
 r[0].volume_1h_tao=100000;
 const unavailable=assessTaoSentiment(r);
 assert.equal(unavailable.reading,null);
 assert.match(unavailable.reason,/Volume comparison coverage/);
});
