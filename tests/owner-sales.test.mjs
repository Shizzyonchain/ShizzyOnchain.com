import test from 'node:test';
import assert from 'node:assert/strict';
import {sumOwnerSales,formatSalesAmount} from '../app/lib/owner-sales.ts';
const now=Date.parse('2026-10-23T12:00:00Z');
const row=(id,hours,extra={})=>({id,timestamp:new Date(now-hours*3600000).toISOString(),swap:{fromToken:'SN51',toToken:'TAO',fromAmount:'9007199254740993',toAmount:'5000000000',taoValue:'5000000000',...extra}});
test('owner sales use exact window boundaries, token scope, fee exclusions and deduplication',()=>{
 const rows=[row('a',24),row('b',168),row('c',169),row('d',-1),row('e',1,{feeConversion:true}),row('f',1,{fromToken:'SN64'}),row('g',1,{toToken:'SN64'}),row('h',1,{taoValue:'4999999999'}),row('a',24)];
 assert.deepEqual(sumOwnerSales(rows,51,now),{day:{alpha:'9007199254740993',tao:'5000000000',trades:1},week:{alpha:'18014398509481986',tao:'10000000000',trades:2}});
 assert.deepEqual(sumOwnerSales([],51,now).day,{alpha:'0',tao:'0',trades:0});
 assert.equal(formatSalesAmount('9007199254740993'),'9,007,199.254740993');
});
