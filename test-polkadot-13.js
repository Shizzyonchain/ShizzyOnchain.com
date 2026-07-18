import { ApiPromise, WsProvider } from '@polkadot/api';
async function main() {
  const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
  const api = await ApiPromise.create({ provider: wsProvider });
  console.log(Object.keys(api.rpc).join(', '));
  console.log(Object.keys(api.rpc.subnetInfo || {}).join(', '));
  process.exit(0);
}
main().catch(console.error);
