import { ApiPromise, WsProvider } from '@polkadot/api';
async function main() {
  const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  const address = '5Dw6oJmgwg4sjGC1Q6HYVz1Bkgsg5FPX2zkZmUkD3NxCikdd';
  
  try {
    // We might need to encode it properly or use the RPC
    const delegated = await api.rpc.delegateInfo.getDelegated(address);
    console.log('delegated:', JSON.stringify(delegated.toHuman(), null, 2));
  } catch (err) {
    console.error('getDelegated err:', err.message);
  }

  process.exit(0);
}
main().catch(console.error);
