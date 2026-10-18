import assert from 'node:assert/strict';
import test from 'node:test';
import { udfCandles } from '../app/lib/taostats-candles.ts';
import { priceBars, aggregateBars } from '../app/lib/chart-data.ts';
const payload = {s:'ok',t:[600,900],o:[1,2],h:[3,4],l:[0.5,1],c:[2,3],v:[10,20]};
test('UDF bars retain alpha volume and aggregate at UTC boundaries',()=>{
 const bars=aggregateBars(priceBars(udfCandles(payload)),600);
 assert.equal(bars.length,1);assert.deepEqual(bars[0],{time:600,open:1,high:4,low:0.5,close:3,volume:30});
});
test('incomplete or invalid provider history never becomes fabricated candles',()=>{
 assert.deepEqual(udfCandles({...payload,s:'no_data'}),[]);
 assert.deepEqual(udfCandles({...payload,c:[2]}),[]);
 assert.equal(udfCandles({...payload,c:[null,3]}).length,1);
 assert.equal(udfCandles({...payload,t:[1e100,900]}).length,1);
 assert.equal(priceBars(udfCandles({...payload,h:[0,4]})).length,1);
});
