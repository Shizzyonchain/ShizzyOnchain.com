import { ApiPromise, WsProvider } from '@polkadot/api';

async function main() {
  const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
  const api = await ApiPromise.create({ 
    provider: wsProvider,
    types: {
      DelegateInfo: {
        delegate_ss58: 'AccountId',
        take: 'Compact<u16>',
        nominators: 'Vec<(AccountId, Compact<u64>)>',
        owner_ss58: 'AccountId',
        registrations: 'Vec<Compact<u16>>',
        validator_permits: 'Vec<Compact<u16>>',
        return_per_1000: 'Compact<u64>',
        total_daily_return: 'Compact<u64>'
      }
    }
  });
  
  const rawBytes = new Uint8Array([8,232,33,133,221,163,144,90,173,231,150,87,129,205,144,59,120,178,191,51,191,179,246,62,198,177,232,121,248,223,142,244,72,81,184,0,160,169,125,40,187,156,81,177,156,34,47,175,13,126,236,63,230,72,232,91,165,192,69,219,139,140,176,156,130,167,141,12,4,97,1,4,97,1,0,11,124,213,228,247,177,1,97,1,3,106,167,94,84,188,14,107,112,18,67,151,140,31,231,61,114,28,123,21,121,67,167,19,252,169,243,200,140,173,122,159,119,153,188,107,38,41,92,0,200,246,35,201,43,71,172,150,69,214,116,79,61,68,140,219,122,42,59,8,162,42,57,191,209,219,10,251,217,192,113,23,4,0,4,0,22,185,144,2,7,40,204,44,137,1,0,11,97,35,86,93,76,30]);
  
  try {
    const decoded = api.registry.createType('Vec<(DelegateInfo, Compact<u64>)>', rawBytes);
    console.log(JSON.stringify(decoded.toHuman(), null, 2));
  } catch(e) {
    console.error("Decoding error:", e);
  }
  
  process.exit(0);
}
main().catch(console.error);
