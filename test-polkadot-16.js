import { ApiPromise, WsProvider } from '@polkadot/api';
async function main() {
  const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  // Is DelegateInfo known?
  try {
    const type = api.registry.createType('DelegateInfo');
    console.log('DelegateInfo type exists!', type.toRawType());
  } catch(e) {
    console.log('DelegateInfo not found natively.');
  }

  process.exit(0);
}
main().catch(console.error);
