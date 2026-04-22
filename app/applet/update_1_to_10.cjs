const fs = require('fs');

const subnets_1_10 = `  { 
    sn: 1, 
    name: "Apex", 
    category: "AI Agents / AI Tools", 
    description: "Decentralized AI agent infrastructure pushing the boundaries of agentic reasoning to reduce hallucinations.",
    teamStatus: "Documented Team",
    details: {
      extendedDescription: "Apex is a Bittensor subnet that’s pushing the boundaries of agentic reasoning by incentivizing miners to build workflows that actively reduce hallucinations and improve the inference quality of large language models. What’s compelling about their approach is how validators host an ongoing competitive arena—where LLMs are equipped with tools."
    }
  },
  { 
    sn: 2, 
    name: "DSperse", 
    category: "Compute", 
    description: "Decentralized framework enabling verifiable AI inference across a network of nodes using zero-knowledge cryptography.",
    teamStatus: "Documented Team",
    details: {
      extendedDescription: "DSperse (formerly known as Omron) is a decentralized framework that enables verifiable AI inference across a network of nodes. In simple terms, it lets AI models run on distributed miners while producing cryptographic proofs (using zero-knowledge technology) that the computation was done correctly. This means users can get AI-generated outputs trustlessly."
    }
  },
  { 
    sn: 3, 
    name: "Deprecated", 
    category: "Unknown", 
    description: "This subnet is currently deprecated.",
    teamStatus: "Undocumented Team",
    details: {
      extendedDescription: "This subnet is currently deprecated and not accepting new tasks or rewards."
    }
  },
  { 
    sn: 4, 
    name: "Targon", 
    category: "Compute", 
    description: "Facilitating a decentralized marketplace for digital commodities related to AI to process and generate information.",
    teamStatus: "Documented Team",
    details: {
      extendedDescription: "Bittensor’s Subnet 4, known as Targon, is an integral component of the Bittensor network, designed to facilitate a decentralized marketplace for a specific category of digital commodities related to artificial intelligence (AI). This subnet enhances AI systems' ability to process and generate information across various data types."
    }
  },
  { 
    sn: 5, 
    name: "Hone", 
    category: "AI Training", 
    description: "Decentralized AI research subnet focused on training models with hierarchical learning and reasoning toward AGI.",
    teamStatus: "Documented Team",
    details: {
      extendedDescription: "Hone (Subnet-5 of the Bittensor network) is a decentralized AI research subnet focused on training a new generation of AI models with hierarchical learning and reasoning toward Artificial General Intelligence (AGI). In essence, Hone’s mission is to “pioneer a new path to AGI by harnessing hierarchical learning and reasoning, through an open network.”"
    }
  },
  { 
    sn: 6, 
    name: "Numinous", 
    category: "Predictive Systems", 
    description: "Decentralized forecasting protocol designed to produce superhuman predictive intelligence through agent aggregation.",
    teamStatus: "Documented Team",
    details: {
      extendedDescription: "Numinous (Subnet 6 of the Bittensor network) is a decentralized forecasting protocol designed to produce superhuman predictive intelligence. In simple terms, it aggregates many AI agents (autonomous forecasting models) and has them compete and evolve to become extremely accurate forecasters. The subnet moves beyond just collecting individual guesses to actively weighting and refining predictions."
    }
  },
  { 
    sn: 7, 
    name: "Always", 
    category: "Infrastructure", 
    description: "Always network.",
    teamStatus: "Undocumented Team",
    details: {
      extendedDescription: "Always is currently an active subnet on the network."
    }
  },
  { 
    sn: 8, 
    name: "Vanta", 
    category: "DeFi / Trading", 
    description: "Decentralized proprietary trading network built to crowdsource advanced trading strategies and signals.",
    teamStatus: "Documented Team",
    details: {
      extendedDescription: "Vanta (Bittensor Subnet 8, formerly known as the Proprietary Trading Network or PTN) is a decentralized proprietary trading network built on the Bittensor blockchain. Its core function is to crowdsource advanced trading strategies from a global pool of participants and turn them into high-quality trading signals. In essence, Vanta operates as a decentralized hedge fund."
    }
  },
  { 
    sn: 9, 
    name: "iota", 
    category: "AI Training", 
    description: "Specialized subnet designed to incentivize the open training of large foundation models on massive web datasets.",
    teamStatus: "Documented Team",
    details: {
      extendedDescription: "IOTA (previously known as Pre-Training) is a specialized subnet of the Bittensor network designed to incentivize the open training of large language models (“foundation models”) on a massive web dataset. In August 2024, Bittensor's Subnet 9 (SN9) demonstrated that a decentralized network of incentivized, permissionless actors could successfully train massive neural networks."
    }
  },
  { 
    sn: 10, 
    name: "Swap", 
    category: "DeFi", 
    description: "Cross-chain DeFi platform for seamlessly buying and selling Bittensor subnet tokens from other blockchains.",
    teamStatus: "Documented Team",
    details: {
      extendedDescription: "Swap (Bittensor Subnet-10) is a cross-chain DeFi platform that lets users seamlessly buy and sell Bittensor subnet tokens from other blockchains (like Base or Ethereum) in a single transaction. In essence, it bridges liquidity from mainstream chains into Bittensor’s decentralized AI network, making it much easier to acquire or exit “alpha” without complex bridging steps."
    }
  },`;

const filepath = 'components/BittensorSubnets.tsx';
let data = fs.readFileSync(filepath, 'utf8');

const re = /(const SUBNETS_DATA: Subnet\[\] = \[)([\s\S]*?)(\{\s*sn: 12,)/;
const match = data.match(re);

if (match) {
  let initial = match[1];
  let tail = match[3];
  
  let newText = initial + '\n' + subnets_1_10 + '\n  ' + tail;
  
  const regexExisting = /const existing = \[(.*?)\];/;
  let match2 = newText.match(regexExisting);
  if(match2) {
      let nums = match2[1].split(',').map(n => n.trim());
      if(!nums.includes('10')) {
          nums.push('10');
          // sort so it's clean
          nums.sort((a,b) => parseInt(a) - parseInt(b));
          newText = newText.replace(regexExisting, `const existing = [${nums.join(', ')}];`);
      }
  }

  fs.writeFileSync(filepath, newText);
  console.log("Successfully injected sn 1-10.");
} else {
  console.log("REGEX MATCH FAILED");
}
