import { ApiPromise, WsProvider } from '@polkadot/api';
import { decodeAddress } from '@polkadot/util-crypto';

async function main() {
  const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  const address = '5Dw6oJmgwg4sjGC1Q6HYVz1Bkgsg5FPX2zkZmUkD3NxCikdd';
  
  console.log('Fetching entries with first key =', address);
  
  // try alpha
  const alphaEntries = await api.query.subtensorModule.alpha.entries(address);
  console.log('alpha matches:', alphaEntries.length);
  if (alphaEntries.length > 0) console.log(alphaEntries[0][1].toString());

  // try alphaV2
  const alphaV2Entries = await api.query.subtensorModule.alphaV2.entries(address);
  console.log('alphaV2 matches:', alphaV2Entries.length);
  if (alphaV2Entries.length > 0) console.log(alphaV2Entries[0][1].toString());

  process.exit(0);
}
main().catch(console.error);
