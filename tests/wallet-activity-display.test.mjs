import assert from 'node:assert/strict';
import test from 'node:test';
import { visibleWalletActivity } from '../app/lib/wallet-activity-display.ts';

test('wallet transfer view includes exactly 5 TAO and excludes dust and unknown amounts', () => {
 const rows=['50000','4999999999','5000000000','5000000001','9007199254740993',null].map((amount,id)=>({id:String(id),amount}));
 assert.deepEqual(visibleWalletActivity(rows,'transfers').map(row=>row.amount),['5000000000','5000000001','9007199254740993']);
 assert.deepEqual(visibleWalletActivity(rows,'transactions'),rows);
});

test('wallet activity hides batch_all wrappers while retaining other calls and transfers', () => {
 const rows=['Utility.batch_all','Utility.batchAll','utility.batch_all','Utility.batch','SubtensorModule.add_stake','Balances.transfer'].map((action,id)=>({id:String(id),action,amount:'6000000000'}));
 assert.deepEqual(visibleWalletActivity(rows,'transactions').map(row=>row.action),['Utility.batch','SubtensorModule.add_stake','Balances.transfer']);
 assert.equal(visibleWalletActivity(rows,'transfers').length,rows.length);
});
