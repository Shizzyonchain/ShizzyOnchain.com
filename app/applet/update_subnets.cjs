const fs = require('fs');

const taostatsNames = {
  1: "Apex", 2: "DSperse", 3: "Deprecated", 4: "Targon",
  5: "Hone", 6: "Numinous", 7: "Always", 8: "Vanta", 9: "iota",
  10: "Swap", 11: "TrajectoryRL", 12: "Compute Horde", 13: "Data Universe",
  14: "TAOHash", 15: "ORO", 16: "BitAds", 17: "404—GEN", 18: "Zeus",
  19: "blockmachine", 20: "GroundLayer", 21: "AdTAO", 22: "Desearch",
  23: "Trishool", 24: "Quasar", 25: "Mainframe", 26: "beqar", 27: "Nodexo",
  28: "gm", 29: "Coldint", 30: "Pending", 31: "Halftime", 32: "ItsAI",
  33: "ReadyAI", 34: "BitMind", 35: "OxMarkets", 36: "Unknown",
  37: "Aurelius", 38: "colosseum", 39: "deprecated", 40: "Chunking",
  41: "Almanac", 42: "Unknown", 43: "Graphite", 44: "Score", 45: "Talisman AI",
  46: "RESI", 47: "EvolAI", 48: "Quantum Compute", 49: "Nepher Robotics",
  50: "Synth", 51: "lium.io", 52: "Dojo", 53: "EfficientFrontier",
  54: "Yanez MIID", 55: "NIOME", 56: "Gradients", 57: "Sparket.AI",
  58: "Handshake", 59: "Babelbit", 60: "Bitsec.ai", 61: "RedTeam",
  62: "Ridges", 63: "Enigma", 64: "Chutes", 65: "TAO Private Network",
  66: "ninja", 67: "Harnyx", 68: "NOVA", 69: "Unknown", 70: "NexisGen",
  71: "Leadpoet", 72: "StreetVision by NATIX", 73: "MetaHash", 74: "Gittensor",
  75: "Hippius", 76: "Byzantium", 77: "Liquidity", 78: "Vocence",
  79: "MVTRX", 80: "dogelayer", 81: "deprecated", 82: "Hermes", 83: "CliqueAI",
  84: "ChipForge (Tatsu)", 85: "Vidaio", 86: "⚒", 87: "Luminar Network",
  88: "Investing", 89: "InfiniteHash", 90: "Unknown", 91: "Bitstarter #1",
  92: "TensorClaw", 93: "Bitcast", 94: "Bitsota", 95: "Unknown",
  96: "Verathos", 97: "distil", 98: "ForeverMoney", 99: "Leoma",
  100: "Plaτform", 101: "Unknown", 102: "ConnitoAI", 103: "Djinn",
  104: "for sale (burn to uid1)", 105: "Beam", 106: "VoidAI", 107: "Minos",
  108: "TalkHead", 109: "Academia", 110: "Green Compute", 111: "oneoneone",
  112: "minotaur", 113: "TensorUSD", 114: "SOMA", 115: "HashiChain",
  116: "TaoLend", 117: "BrainPlay", 118: "HODL", 119: "Satori", 120: "Affine",
  121: "sundae_bar", 122: "Bitrecs", 123: "MANTIS", 124: "Swarm",
  125: "8 Ball", 126: "Poker44", 127: "Astrid", 128: "ByteLeap"
};

const filepath = 'components/BittensorSubnets.tsx';
let data = fs.readFileSync(filepath, 'utf8');

// We need to carefully replace the SUBNETS_DATA array.
// Because parsing TS with regex is hard, we can just replace the names in the first loop
// where they are hardcoded, and then update the `Array.from` loop.

let updatedData = data;

// 1. We replace the hardcoded instances where the `name: "OldName"` matches a known sub array item
// The original file has manually detailed objects for some subnets: 1,2,3,4,5,6,7,8,9,12,13,18,19,22,24,32
// We will replace `name: "..."` with `name: "NEW_NAME"` for those block

const manualSubnets = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 18, 19, 22, 24, 32];
for (const sn of manualSubnets) {
  // Let's locate the block for sn
  const snPattern = new RegExp(`(\\{\\s*sn:\\s*${sn}\\s*,\\s*name:\\s*")([^"]*)(")`, 'g');
  updatedData = updatedData.replace(snPattern, (match, p1, oldName, p3) => {
    return p1 + taostatsNames[sn] + p3;
  });
}

// 2. We replace the knownNames object in the fallback loop
// It originally looked like:
/*
    const knownNames: Record<number, { name: string, category: string }> = {
      10: { name: "Swap", category: "DeFi" },
      ...
    };
*/
// We'll replace the entire `...Array.from({ length: 128 }` block down to the end of the array.

const arrayPattern = /\\.\\.\\.Array\\.from\\(\\{ length: 128 \\}, \\(_, i\\) => \\{[\\s\\S]*?return \\{[^}]+\\};\\s*\\}\\)\\.filter\\(Boolean\\) as Subnet\\[\\]/;
const newArrayLogic = `...Array.from({ length: 128 }, (_, i) => {
    const sn = i + 1;
    const existing = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 18, 19, 22, 24, 32];
    if (existing.includes(sn)) return null;

    const taostatsNames: Record<number, string> = {
${Object.entries(taostatsNames).filter(([sn]) => !manualSubnets.includes(parseInt(sn))).map(([sn, name]) => `      ${sn}: ${JSON.stringify(name)}`).join(",\\n")}
    };

    return {
      sn,
      name: taostatsNames[sn] || \`Subnet \${sn}\`,
      category: "Unknown",
      description: "Active Bittensor subnet.",
      teamStatus: "Undocumented Team"
    };
  }).filter(Boolean) as Subnet[]`;

updatedData = updatedData.replace(arrayPattern, newArrayLogic);

// Write changes
fs.writeFileSync(filepath, updatedData);
console.log('Update complete.');
