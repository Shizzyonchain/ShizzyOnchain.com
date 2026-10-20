import test from 'node:test';
import assert from 'node:assert/strict';
import {decodeEmission,emissionPercent} from '../app/lib/etao.ts';
import fs from 'node:fs';
const seed=JSON.parse(fs.readFileSync(new URL('../app/data/etao.json',import.meta.url)));
test('SCALE emission vectors preserve u64 precision and reject incomplete totals',()=>{
 const weights=seed.weights['122'];const bytes=Buffer.alloc(41);bytes[0]=20;weights.forEach((v,i)=>bytes.writeBigUInt64LE(BigInt(v),1+i*8));
 assert.deepEqual(decodeEmission('0x'+bytes.toString('hex')),weights);
 assert.equal(emissionPercent(weights[4]),'64.00%');
 bytes.writeBigUInt64LE(0n,17);assert.throws(()=>decodeEmission(bytes.toString('hex')));
 assert.throws(()=>decodeEmission('0x00'));
});
test('audited history contains unique transactions with reconciled before and after vectors',()=>{
 assert.equal(new Set(seed.changes.map(r=>`${r.block}-${r.extrinsic}`)).size,6);
 for(const row of seed.changes)for(const w of [row.before,row.after])assert.equal(w.reduce((s,v)=>s+BigInt(v),0n),18446744073709551615n);
 assert.ok(seed.changes.every(r=>r.netuid!==74));
 assert.equal(Object.keys(seed.weights).length,128);
});

