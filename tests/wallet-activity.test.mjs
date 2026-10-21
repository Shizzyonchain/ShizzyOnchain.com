import assert from 'node:assert/strict';
import test from 'node:test';
import {validWalletAddress,activityRows} from '../app/lib/wallet-activity.ts';
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
