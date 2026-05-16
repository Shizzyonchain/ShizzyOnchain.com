import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const articles = [
  {
    id: 'bitrecs-mining-guide',
    date: 'MAY 16, 2026',
    category: 'MINING GUIDE',
    title: 'Beginner Guide To Mining Bitrecs SN122 On Bittensor',
    image: 'https://i.postimg.cc/VvDn7D12/Ljt-QQf-Yq-400x400.jpg',
  },
  {
    id: 'conviction-mechanism',
    date: 'MAY 11, 2026',
    category: 'TAO PROTOCOL UPDATE',
    title: 'CONVICTION MECHANISM',
    image: 'https://i.postimg.cc/yxBR8sD3/41557947-336d-4756-b4ed-50de4705f346.png',
  }
];

export const LatestArticles: React.FC = () => {
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const selectedArticle = articles.find(a => a.id === selectedArticleId);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-16 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-orange-600/20">
            LATEST DROPS
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            LATEST <span className="text-orange-600">ARTICLES</span>
          </h1>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedArticleId ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {articles.map((article) => (
              <div 
                key={article.id}
                onClick={() => setSelectedArticleId(article.id)}
                className="group cursor-pointer bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden hover:border-orange-500/40 transition-all duration-500 flex flex-col"
              >
                <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-black/50 overflow-hidden relative">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500">
                    {article.date} // {article.category}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic leading-tight">
                    {article.title}
                  </h3>
                  <div className="mt-auto pt-4 text-sm font-bold text-slate-500 group-hover:text-orange-500 transition-colors uppercase tracking-widest flex items-center gap-2">
                    Read Article &rarr;
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="article"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <button 
              onClick={() => setSelectedArticleId(null)}
              className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-500 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Articles
            </button>

            {selectedArticleId === 'bitrecs-mining-guide' && (
              <div className="group relative flex flex-col w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="w-full bg-slate-100 dark:bg-black/50 overflow-hidden relative border-b border-white/5">
                    <img 
                      src="https://i.postimg.cc/VvDn7D12/Ljt-QQf-Yq-400x400.jpg" 
                      alt="Bitrecs Miner Guide Graphic" 
                      className="w-full h-auto max-h-[500px] object-contain object-center bg-black/40" 
                      referrerPolicy="no-referrer"
                    />
                </div>
                
                <div className="p-8 md:p-12 space-y-8">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">MAY 16, 2026 // MINING GUIDE</span>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">
                            Beginner Guide To Mining <span className="text-orange-500">Bitrecs SN122</span> On Bittensor
                        </h2>
                        
                        <div className="space-y-6 text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-4xl">
                            <p>If you are brand new to Bittensor mining and you want a subnet that is not insanely complicated to start with, Bitrecs SN122 is one I would look at first.</p>
                            
                            <p>Bitrecs is a Bittensor subnet focused on ecommerce product recommendations.</p>
                            
                            <p>In simple terms, miners on this subnet are not mining with huge GPU rigs like old school crypto mining. They are running software that responds to product recommendation requests. The miner uses an LLM provider, such as Grok, OpenRouter, ChatGPT, Gemini, Chutes, vLLM, or Ollama, depending on how you want to set it up.</p>
                            
                            <p className="text-xl font-bold text-slate-900 dark:text-slate-100 pt-4">That is why this subnet is a good beginner target.</p>
                            
                            <ul className="list-disc pl-6 space-y-2 opacity-90">
                               <li>You do not need to start with some crazy home GPU setup.</li>
                               <li>You can start with a clean Ubuntu VPS, one hotkey, one LLM API key, and a miner process that stays online.</li>
                            </ul>
                            
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 pt-8 uppercase tracking-tight">The goal at first is simple:</h3>
                            <ol className="list-decimal pl-6 space-y-2 font-mono text-sm text-orange-500">
                               <li>Get the miner running.</li>
                               <li>Keep it online.</li>
                               <li>Make sure validators can reach it.</li>
                               <li>Then worry about optimizing.</li>
                            </ol>

                            <p className="font-bold text-slate-900 dark:text-slate-100 pt-4">Most people mess up because they try to be clever too early. Do not do that. A stable miner comes first.</p>
                            
                            <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl space-y-3 mt-8">
                               <h4 className="font-bold text-xl text-slate-900 dark:text-slate-100 uppercase tracking-tight">Official Sources</h4>
                               <p className="text-sm">Use the official sources before burning TAO or setting anything up.</p>
                               <div className="space-y-2 text-sm font-mono overflow-auto">
                                  <a href="https://github.com/bitrecs/bitrecs-subnet" target="_blank" rel="noopener noreferrer" className="block text-orange-500 hover:text-orange-400">github.com/bitrecs/bitrecs-subnet</a>
                                  <a href="https://github.com/bitrecs/bitrecs-subnet/docs/running_miner.md" target="_blank" rel="noopener noreferrer" className="block text-orange-500 hover:text-orange-400">github.com/bitrecs/bitrecs-subnet/docs/running_miner.md</a>
                                  <a href="https://docs.learnbittensor.org/miners" target="_blank" rel="noopener noreferrer" className="block text-orange-500 hover:text-orange-400">docs.learnbittensor.org/miners</a>
                                  <a href="https://bittensor.ai/subnets/122" target="_blank" rel="noopener noreferrer" className="block text-orange-500 hover:text-orange-400">bittensor.ai/subnets/122</a>
                               </div>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 pt-8 uppercase tracking-tight">What You Need Before You Start</h3>
                            <p>You will need a few things before trying to mine Bitrecs SN122.</p>
                            <ul className="list-disc pl-6 space-y-2">
                               <li>An Ubuntu server</li>
                               <li>A Bittensor wallet</li>
                               <li>A coldkey and hotkey</li>
                               <li>Enough TAO to register on subnet 122 and cover fees</li>
                               <li>One LLM provider API key</li>
                               <li>A stable internet connection</li>
                               <li>A miner process that can stay online</li>
                            </ul>
                            
                            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">For a starter VPS, I would look for something around:</h4>
                            <ul className="list-disc pl-6 space-y-1 font-mono text-sm opacity-80">
                               <li>2 to 4 vCPU</li>
                               <li>8 to 16 GB RAM</li>
                               <li>50 GB disk or more</li>
                               <li>Ubuntu</li>
                               <li>Public IP</li>
                            </ul>
                            
                            <p>You do not need to use your home GPU for the first attempt. A VPS is cleaner because it stays online, it is easier to manage, and you are not depending on your personal computer running 24/7.</p>
                            
                            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl space-y-3 mt-8 text-red-500">
                               <h4 className="font-black text-xl uppercase tracking-tighter italic">Safety First</h4>
                               <ul className="list-disc pl-6 space-y-2 opacity-90 font-bold">
                                  <li>Do not paste your seed phrase into ChatGPT.</li>
                                  <li>Do not send your seed phrase to anyone.</li>
                                  <li>Do not put your main coldkey seed on a mining server unless you know exactly what risk you are taking.</li>
                               </ul>
                               <p className="text-slate-600 dark:text-slate-300">The cleaner way is to keep your master coldkey on a safer local device and only put what the server needs on the VPS. The Bitrecs guide recommends using <code>regen_coldkeypub</code> on the mining server, which means the server only has the public coldkey information.</p>
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 pt-8 uppercase tracking-tight">Simple Setup Flow</h3>
                            
                            <p>The whole setup is basically:</p>
                            <ol className="list-decimal pl-6 space-y-1 opacity-90 text-sm font-mono mt-4">
                               <li>Prepare Ubuntu</li>
                               <li>Install the needed system tools</li>
                               <li>Create a Python virtual environment</li>
                               <li>Clone the Bitrecs repo</li>
                               <li>Install the miner package</li>
                               <li>Set up the wallet pieces</li>
                               <li>Register the hotkey on subnet 122</li>
                               <li>Add your LLM API key</li>
                               <li>Start the miner with PM2</li>
                               <li>Watch the logs and make sure it works</li>
                            </ol>

                            <h4 className="font-black text-xl text-slate-900 dark:text-slate-100 mt-8 mb-4">Step 1: Prepare Ubuntu</h4>
                            <pre className="bg-slate-100 dark:bg-black/50 p-4 rounded-xl font-mono text-sm overflow-x-auto text-orange-500">sudo apt-get update && sudo apt-get upgrade -y
sudo apt install -y ufw
sudo ufw allow 22
sudo ufw allow proto tcp to 0.0.0.0/0 port 8091
sudo ufw enable
sudo ufw reload</pre>

                            <h4 className="font-black text-xl text-slate-900 dark:text-slate-100 mt-8 mb-4">Step 2: Install Python Tools</h4>
                            <pre className="bg-slate-100 dark:bg-black/50 p-4 rounded-xl font-mono text-sm overflow-x-auto text-orange-500">sudo apt install -y python3-pip python3.12-venv git
sudo mkdir -p /root/pip_tmp
export TMPDIR=/root/pip_tmp
sudo mount -o remount,size=8G /tmp</pre>

                            <h4 className="font-black text-xl text-slate-900 dark:text-slate-100 mt-8 mb-4">Step 3: Create Your Working Folder</h4>
                            <pre className="bg-slate-100 dark:bg-black/50 p-4 rounded-xl font-mono text-sm overflow-x-auto text-orange-500">mkdir -p ~/bt
cd ~/bt
python3.12 -m venv bt_venv
source bt_venv/bin/activate
echo "source ~/bt/bt_venv/bin/activate" &gt;&gt; ~/.bashrc</pre>

                            <h4 className="font-black text-xl text-slate-900 dark:text-slate-100 mt-8 mb-4">Step 4: Install Bitrecs</h4>
                            <pre className="bg-slate-100 dark:bg-black/50 p-4 rounded-xl font-mono text-sm overflow-x-auto text-orange-500">git clone https://github.com/bitrecs/bitrecs-subnet.git
cd bitrecs-subnet
python3 -m pip install -e .
sudo apt install -y nodejs npm
sudo npm install -g pm2</pre>

                            <h4 className="font-black text-xl text-slate-900 dark:text-slate-100 mt-8 mb-4">Step 5: Wallet Setup</h4>
                            <p>The Bitrecs guide shows this setup on the mining server:</p>
                            <pre className="bg-slate-100 dark:bg-black/50 p-4 rounded-xl font-mono text-sm overflow-x-auto text-orange-500">btcli w regen_coldkeypub
btcli w regen_hotkey</pre>

                            <h4 className="font-black text-xl text-slate-900 dark:text-slate-100 mt-8 mb-4">Step 6: Check The Live Burn Before Registering</h4>
                            <pre className="bg-slate-100 dark:bg-black/50 p-4 rounded-xl font-mono text-sm overflow-x-auto text-orange-500">btcli subnet show --netuid 122 --network finney
btcli subnet register --netuid 122 --network finney --wallet.name default --wallet.hotkey default</pre>

                            <h4 className="font-black text-xl text-slate-900 dark:text-slate-100 mt-8 mb-4">Step 7: Configure Your LLM API Key</h4>
                            <pre className="bg-slate-100 dark:bg-black/50 p-4 rounded-xl font-mono text-sm overflow-x-auto text-orange-500">nano .env</pre>
                            <p>Pick one like Grok, add the key, and get the miner running first.</p>
                            <pre className="bg-slate-100 dark:bg-black/50 p-4 rounded-xl font-mono text-sm overflow-x-auto text-orange-500">GROK_API_KEY="..."</pre>

                            <h4 className="font-black text-xl text-slate-900 dark:text-slate-100 mt-8 mb-4">Step 8: Start The Miner</h4>
                            <pre className="bg-slate-100 dark:bg-black/50 p-4 rounded-xl font-mono text-sm overflow-x-auto text-orange-500">pm2 start ./neurons/miner.py --name miner -- \
  --netuid 122 \
  --network finney \
  --wallet.name default \
  --wallet.hotkey default \
  --logging.trace \
  --llm.model x-ai/grok-4-fast \
  --verified.inference

pm2 save
pm2 startup</pre>

                            <h4 className="font-black text-xl text-slate-900 dark:text-slate-100 mt-8 mb-4">Step 9: Monitor The Miner</h4>
                            <pre className="bg-slate-100 dark:bg-black/50 p-4 rounded-xl font-mono text-sm overflow-x-auto text-orange-500">pm2 list
pm2 logs miner</pre>

                            <div className="bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl space-y-4 mt-12">
                               <h3 className="font-black text-2xl uppercase tracking-tight italic text-slate-900 dark:text-white">My Beginner Take</h3>
                               <p>If I was starting from zero, I would keep it very simple.</p>
                               <ul className="list-disc pl-6 space-y-1">
                                  <li>Use an Ubuntu VPS.</li>
                                  <li>Register one hotkey on subnet 122.</li>
                                  <li>Use one hosted LLM provider.</li>
                                  <li>Start the miner with PM2.</li>
                                  <li>Watch it for 24 hours.</li>
                               </ul>
                               <p className="font-bold text-orange-500 pt-4">Get online first. Stay online. Then get better.</p>
                            </div>

                        </div>
                    </div>
                </div>
              </div>
            )}

            {selectedArticleId === 'conviction-mechanism' && (
              <div className="group relative flex flex-col w-full">
                <div className="w-full bg-slate-100 dark:bg-black/50 overflow-hidden mb-6 relative rounded-2xl md:rounded-[3rem] border border-slate-200 dark:border-white/5">
                  <a href="https://postimg.cc/1nCXWxcy" target="_blank" rel="noopener noreferrer">
                    <img 
                      src="https://i.postimg.cc/yxBR8sD3/41557947-336d-4756-b4ed-50de4705f346.png" 
                      alt="Conviction Mechanism Graphic" 
                      className="w-full h-auto max-h-[500px] object-contain bg-black/40" 
                      referrerPolicy="no-referrer"
                    />
                  </a>
                </div>
                
                <div className="flex items-center justify-between px-4">
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">MAY 11, 2026 // TAO PROTOCOL UPDATE</span>
                    <a href="https://postimg.cc/1nCXWxcy" target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 hover:text-orange-400 transition-colors">
                      VIEW FULL SIZE
                    </a>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

