import { ApiPromise, WsProvider } from '@polkadot/api';
async function main() {
  const wsProvider = new WsProvider('wss://entrypoint-finney.opentensor.ai:443');
  const api = await ApiPromise.create({ provider: wsProvider });
  
  const tao = await api.query.subtensorModule.subnetTAO.entries();
  const alphaIn = await api.query.subtensorModule.subnetAlphaIn.entries();
  const alphaOut = await api.query.subtensorModule.subnetAlphaOut.entries();
  
  if (tao.length > 0) {
    console.log('TAO:', tao[0][0].args[0].toString(), tao[0][1].toString());
    const netuid = tao[0][0].args[0].toString();
    const ain = alphaIn.find(x => x[0].args[0].toString() === netuid);
    const aout = alphaOut.find(x => x[0].args[0].toString() === netuid);
    console.log('AlphaIn:', ain ? ain[1].toString() : 'null');
    console.log('AlphaOut:', aout ? aout[1].toString() : 'null');
  }

  process.exit(0);
}
main().catch(console.error);
