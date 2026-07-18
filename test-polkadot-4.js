import { ApiPromise, WsProvider } from '@polkadot/api';
async function main() {
  const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  const alphaV2Meta = api.query.subtensorModule.alpha.meta;
  console.log('alpha key names:', alphaV2Meta.type.asMap.key.toString());
  
  // let's print the actual arguments names if possible
  const lookup = api.registry.lookup;
  const keyType = lookup.getTypeDef(alphaV2Meta.type.asMap.key);
  console.log('Key type:', JSON.stringify(keyType, null, 2));

  process.exit(0);
}
main().catch(console.error);
