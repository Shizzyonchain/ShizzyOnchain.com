import { ApiPromise, WsProvider } from '@polkadot/api';
async function main() {
  const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
  const api = await ApiPromise.create({ provider: wsProvider });
  console.log('alphaAssets:', Object.keys(api.query.alphaAssets));
  
  // Let's get the alpha balances for our test address
  // The structure is probably api.query.subtensorModule.alpha(address, netuid) or api.query.alphaAssets.account(netuid, address)?
  // Let's print out what arguments they expect
  console.log('subtensorModule.alpha arguments:', api.query.subtensorModule.alpha.meta.type.asMap.key.toString());
  console.log('subtensorModule.alphaV2 arguments:', api.query.subtensorModule.alphaV2.meta.type.asMap.key.toString());
  
  console.log('subtensorModule.subnetAlphaIn arguments:', api.query.subtensorModule.subnetAlphaIn.meta.type.toString());
  console.log('subtensorModule.subnetAlphaOut arguments:', api.query.subtensorModule.subnetAlphaOut.meta.type.toString());
  console.log('subtensorModule.subnetTAO arguments:', api.query.subtensorModule.subnetTAO.meta.type.toString());
  process.exit(0);
}
main().catch(console.error);
