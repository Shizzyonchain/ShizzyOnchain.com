import { ApiPromise, WsProvider } from '@polkadot/api';
async function main() {
  const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  const lookup = api.registry.lookup;

  // For alpha
  const alphaMeta = api.query.subtensorModule.alpha.meta;
  const alphaKey = lookup.getTypeDef(alphaMeta.type.asMap.key);
  console.log('alpha key type:', JSON.stringify(alphaKey, null, 2));

  // For alphaV2
  const alphaV2Meta = api.query.subtensorModule.alphaV2.meta;
  const alphaV2Key = lookup.getTypeDef(alphaV2Meta.type.asMap.key);
  console.log('alphaV2 key type:', JSON.stringify(alphaV2Key, null, 2));

  process.exit(0);
}
main().catch(console.error);
