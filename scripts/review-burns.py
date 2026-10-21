from substrateinterface import SubstrateInterface
from scalecodec.base import ScaleBytes
import websocket,json,time,argparse,os
from pathlib import Path
from datetime import datetime,timezone
parser=argparse.ArgumentParser(description="Read finalized non-miner burn events. No signing or transactions.")
parser.add_argument('--from-block',type=int,required=True);parser.add_argument('--to-block',type=int);parser.add_argument('--output',required=True)
args=parser.parse_args();endpoint=os.environ.get('ETAO_RPC_URL','wss://archive.chain.opentensor.ai:443')
s=SubstrateInterface(url=endpoint,ws_options={"timeout":30});head=s.get_chain_finalised_head();finalized=s.get_block_number(head);end=args.to_block or finalized
if args.from_block<1 or end<args.from_block or end>finalized:raise ValueError('Invalid finalized block interval')
head=s.get_block_hash(end);s.init_runtime(block_hash=head)
if s.rpc_request('state_getRuntimeVersion',[head])['result']['specVersion']!=481 or s.rpc_request('state_getRuntimeVersion',[s.get_block_hash(args.from_block)])['result']['specVersion']!=481:raise ValueError('This reviewed decoder supports runtime 481 only; review metadata before extending it')
ws=websocket.create_connection(endpoint,timeout=45)
def batch(method,params):
 ws.send(json.dumps([{"jsonrpc":"2.0","id":i,"method":method,"params":p} for i,p in enumerate(params)]))
 r=json.loads(ws.recv())
 if not isinstance(r,list): raise RuntimeError(str(r))
 r=sorted(r,key=lambda x:x['id'])
 if any('error' in x for x in r):raise RuntimeError(str(r)[:300])
 return [x['result'] for x in r]
o={"checkedAt":datetime.now(timezone.utc).isoformat(),"fromBlock":args.from_block,"toBlock":end,"finalizedHash":head,"runtime":481,"source":"Configured chain RPC" if os.environ.get("ETAO_RPC_URL") else "Opentensor archive RPC","scannedThrough":args.from_block-1,"events":[],"errors":[]}
p=Path(args.output);p.parent.mkdir(parents=True,exist_ok=True)
for start in range(o['fromBlock'],end+1,40):
 try:
  ns=list(range(start,min(start+40,end+1)));hs=batch('chain_getBlockHash',[[n] for n in ns]);raw=batch('state_getStorage',[["0x26aa394eea5630e07c48ae0c9558cef780d41e5e16056765bc8461851072c9d7",h] for h in hs])
  for n,h,r in zip(ns,hs,raw):
   b=bytes.fromhex(r[2:])
   if not any(x in b for x in [bytes.fromhex('0762'),bytes.fromhex('077d'),bytes.fromhex('050b'),bytes.fromhex('0761')]):continue
   q=s.runtime_config.create_scale_object('scale_info::20',data=ScaleBytes(r),metadata=s.metadata);rows=q.decode()
   targets=[(i,e) for i,e in enumerate(rows) if (e['module_id']=='SubtensorModule' and e['event_id'] in ['AlphaBurned','AddStakeBurn','AlphaRecycled']) or (e['module_id']=='Balances' and e['event_id']=='Burned')]
   if targets:
    ts=s.query('Timestamp','Now',block_hash=h).value
    for idx,e in targets:o['events'].append({'block':n,'hash':h,'timestamp':ts,'eventIndex':idx,'event':e,'sameExtrinsicEvents':[x for x in rows if x['extrinsic_idx']==e['extrinsic_idx']]})
  o['scannedThrough']=ns[-1]
 except Exception as e:
  o['errors'].append({'start':start,'end':min(start+39,end),'error':str(e)[:250]});print('ERROR',o['errors'][-1],flush=True)
 p.write_text(json.dumps(o,default=str,indent=2));print('SCANNED',o['scannedThrough'],'EVENTS',len(o['events']),flush=True)
o['completedAt']=datetime.now(timezone.utc).isoformat();p.write_text(json.dumps(o,default=str,indent=2));ws.close();s.close();print('DONE',len(o['events']),flush=True)
if o['errors']:raise SystemExit('Incomplete scan: inspect error ranges before publication')

