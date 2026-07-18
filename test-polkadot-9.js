import { ApiPromise, WsProvider } from '@polkadot/api';
async function main() {
  const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
  const api = await ApiPromise.create({ 
    provider: wsProvider,
    rpc: {
      delegateInfo: {
        getDelegated: {
          description: 'Get delegated',
          params: [
            { name: 'coldkey', type: 'Bytes' }
          ],
          type: 'Bytes'
        }
      }
    }
  });
  
  const address = '5Dw6oJmgwg4sjGC1Q6HYVz1Bkgsg5FPX2zkZmUkD3NxCikdd';
  // we must encode it as scale encoded bytes maybe? Or simply pass the AccountId representation
  // let's pass the raw address string as it converts to AccountId usually, but our type says Bytes.
  // let's change type to AccountId!
  process.exit(0);
}
main().catch(console.error);
