import test from 'node:test';
import assert from 'node:assert/strict';
import { rankValidators } from '../app/lib/validator-ranking.ts';
import { limitedHistoryOptions } from '../app/lib/validator-current-options.ts';
const now=Date.parse('2026-10-24T05:15:00Z');
const base={hotkey:'active',name:'Active',take:.09,yield7:1.2,yield30:1.1,participation7:1,participation30:.78,active:true,permit:true,updated:100,cutoff:5000,stakeShare:.5,dividends:.5,registered:'2025-01-01',timestamps:Array(5).fill('2026-10-24T05:00:00Z'),yieldBasis:'nominator-net'};
test('limited-history choice stays outside full recommendation ranking',()=>{const rows=rankValidators([base], 'balanced',now);assert.equal(rows[0].score,null);assert.equal(limitedHistoryOptions(rows).length,1);});
test('missing, stale, unverified or poor recent participation cannot enter current options',()=>{const bad=[{...base,hotkey:'stale',timestamps:Array(5).fill('2026-10-23T05:00:00Z')},{...base,hotkey:'inactive',active:false},{...base,hotkey:'unknown',participation30:null},{...base,hotkey:'recent',participation7:.8}];assert.equal(limitedHistoryOptions(rankValidators(bad,'balanced',now)).length,0);});
