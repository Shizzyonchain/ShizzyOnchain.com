import { decodeAddress } from '@polkadot/util-crypto';
import { u8aToHex } from '@polkadot/util';

const addr = '5Dw6oJmgwg4sjGC1Q6HYVz1Bkgsg5FPX2zkZmUkD3NxCikdd';
const pubkey = decodeAddress(addr);
const pubkeyArray = Array.from(pubkey);

console.log("pubkey array:", pubkeyArray);
console.log("pubkey hex:", u8aToHex(pubkey));
