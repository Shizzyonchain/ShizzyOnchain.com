import assert from 'node:assert/strict';
import test from 'node:test';
import {validWalletAddress,activityRows,swapRows} from '../app/lib/wallet-activity.ts';
const address='5FqACMtcegZxxopgu1g7TgyrnyD8skurr9QDPLPhxNQzsThe';
test('wallet addresses require a valid Finney SS58 checksum',()=>{
 assert.equal(validWalletAddress(address),true);
 assert.equal(validWalletAddress(address.slice(0,-1)+'a'),false);
 assert.equal(validWalletAddress('../secret'),false);
});
test('signed calls preserve failures and reject another wallet',()=>{
 const row={id:'123-0001',timestamp:'2026-10-21T12:00:00Z',pallet:'SubtensorModule',name:'add_stake',success:false,signer_address:address};
 assert.equal(activityRows([row],'transactions',address)[0].success,false);
 assert.throws(()=>activityRows([{...row,signer_address:'other'}],'transactions',address));
 assert.throws(()=>activityRows([null],'transactions',address));
});
test('incoming and outgoing transfers preserve raw precision without summing fees',()=>{
 const row={id:'123-0001-0002',extrinsic_id:'123-0001',timestamp:'2026-10-21T12:00:00Z',network:'finney',amount:'9007199254740993',from:'other',to:address};
 const incoming=activityRows([row],'transfers',address)[0];assert.equal(incoming.action,'Received TAO');assert.equal(incoming.amount,row.amount);
 assert.equal(activityRows([{...row,from:address,to:'other'}],'transfers',address)[0].action,'Sent TAO');
 assert.throws(()=>activityRows([{...row,to:'another'}],'transfers',address));
 assert.throws(()=>activityRows([{...row,extrinsic_id:'javascript:foo'}],'transfers',address));
});

test('swap evidence preserves raw token amounts, wallet scope and multiple trades in one extrinsic',()=>{
 const row={id:'trade-1',extrinsic_id:'9340000-0002',timestamp:'2026-10-22T12:00:00Z',coldkey:address,from_name:'SN51',to_name:'SN64',from_amount:'9007199254740993',to_amount:'10000000001',tao_value:'5000000000'};
 const swap=swapRows([row],'swaps',address)[0];assert.equal(swap.swap.fromAmount,row.from_amount);assert.equal(swap.swap.toToken,'SN64');
 assert.throws(()=>swapRows([{...row,coldkey:'other'}],'swaps',address));
 assert.throws(()=>swapRows([{...row,to_amount:'1.5'}],'swaps',address));
 assert.throws(()=>swapRows([{...row,to_name:'<script>'}],'swaps',address));
 const trades=swapRows([{...row,id:'one',from_name:'TAO'},{...row,id:'two',to_name:'TAO'}],'trades',address);
 assert.equal(trades.length,2);assert.notEqual(trades[0].id,trades[1].id);assert.equal(trades[0].action,'Bought SN64 alpha with TAO');assert.equal(trades[1].action,'Sold SN51 alpha for TAO');
});
