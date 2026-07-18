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
            { name: 'coldkey', type: 'AccountId' }
          ],
          type: 'Bytes'
        }
      }
    }
  });
  
  const address = '5Dw6oJmgwg4sjGC1Q6HYVz1Bkgsg5FPX2zkZmUkD3NxCikdd';
  console.log('Calling getDelegated with AccountId...');
  try {
    const res = await api.rpc.delegateInfo.getDelegated(address);
    console.log(res.toHex().substring(0, 100)); // Just to see if it works!
  } catch (err) {
    console.error(err);
  }

  process.exit(0);
}
main().catch(console.error);
