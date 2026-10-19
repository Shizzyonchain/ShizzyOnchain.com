import test from 'node:test';
import assert from 'node:assert/strict';
import { readDrawings, logicalForTime, timeForLogical } from '../app/lib/chart-drawings.ts';
const p=(time,price=10)=>({time,price});
test('legacy levels and trend lines survive; invalid drawing payloads are rejected',()=>{
 const result=readDrawings([{kind:'level',start:p(100)},{kind:'trend',start:p(100),end:p(200),color:'#46bfff'}, {kind:'unknown',start:p(100)}, {kind:'circle',start:p(100),end:p(200,-2)}, {kind:'brush',start:p(100),points:[p(100)]}]);
 assert.equal(result.length,2);assert.equal(result[0].width,3);assert.equal(result[1].color,'#46bfff');
});
test('freehand preserves backward time motion and multiple prices on the same time',()=>{
 const points=[p(100,5),p(101,7),p(100.5,8),p(100.5,3),p(99,5)];
 assert.deepEqual(readDrawings([{kind:'brush',start:points[0],points}])[0].points,points);
});
test('fractional drawing anchors round-trip across irregular and calendar candles',()=>{
 const times=[100,200,450,700];
 for(const logical of [-1,0,.1,.5,1,1.75,2.9,3,4])assert.ok(Math.abs(logicalForTime(times,timeForLogical(times,logical))-logical)<1e-9);
});
test('circles and saved styles survive reload with bounded storage',()=>{
 const shape={kind:'circle',start:p(100),end:p(200,12),color:'#23d18b',width:5};
 assert.deepEqual(readDrawings(JSON.parse(JSON.stringify([shape]))),[shape]);
 assert.equal(readDrawings(Array(60).fill(shape)).length,40);
 assert.equal(readDrawings([{kind:'brush',start:p(1),points:Array(1025).fill(p(1))}]).length,0);
});
