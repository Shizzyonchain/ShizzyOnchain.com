import { ApiPromise, WsProvider } from '@polkadot/api';
async function main() {
  const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
  const api = await ApiPromise.create({ provider: wsProvider });
  console.log('Connected to Bittensor node');
  
  // Wallet address
  const address = '5Dw6oJmgwg4sjGC1Q6HYVz1Bkgsg5FPX2zkZmUkD3NxCikdd';
  
  // Fetch system account
  const account = await api.query.system.account(address);
  console.log(`Free balance: ${account.data.free.toString()}`);
  
  // Try to find Alpha/Subnet info
  // The module is likely `SubtensorModule`
  console.log('Available modules:');
  const modules = Object.keys(api.query).filter(k => k.toLowerCase().includes('subtensor') || k.toLowerCase().includes('alpha') || k.toLowerCase().includes('dynamic'));
  console.log(modules);

  const keys = Object.keys(api.query.subtensorModule || {});
  console.log('SubtensorModule queries:', keys);

  process.exit(0);
}
main().catch(console.error);
