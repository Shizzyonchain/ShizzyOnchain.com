const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf-8');
code = code.replace(
  /if \(\!api\) \{\n      return res\.status\(503\)\.json\(\{ error: "Blockchain synchronizing, please try again\." \}\);\n    \}/,
  `if (!api) {
      console.log("Waiting for blockchain connection...");
      await initPolkadot();
    }`
);
code = code.replace(
  /let api: ApiPromise \| null = null;/,
  `let api: ApiPromise | null = null;\nlet initPromise: Promise<void> | null = null;`
);
code = code.replace(
  /async function initPolkadot\(\) \{/,
  `async function initPolkadot() {
  if (initPromise) return initPromise;
  initPromise = (async () => {`
);
code = code.replace(
  /setInterval\(updatePrices, 60000\); \/\/ every minute\n\}/,
  `setInterval(updatePrices, 60000); // every minute
  })();
  return initPromise;
}`
);
code = code.replace(
  /initPolkadot\(\);\n  \n  const distPath = path.join\(process.cwd\(\), 'dist'\);/,
  `const distPath = path.join(process.cwd(), 'dist');`
);
fs.writeFileSync('server.ts', code);
