import https from 'https';

const getUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => { resolve({statusCode: res.statusCode, data}); });
    }).on('error', (err) => { reject(err); });
  });
};

const urls = [
  'https://api.taomarketcap.com/api/v1/subnets',
  'https://api.taomarketcap.com/v1/subnets',
  'https://api.taomarketcap.com/subnets',
  'https://api.taomarketcap.com/api/subnets',
  'https://api.taomarketcap.com/beta/subnets'
];

async function run() {
  for (const url of urls) {
    try {
      const { statusCode, data } = await getUrl(url);
      console.log(`URL: ${url} - Status: ${statusCode}`);
      if (statusCode === 200 && data.includes('{')) {
        console.log(`Success! Data preview: ${data.substring(0, 500)}`);
        break;
      }
    } catch (e) {
      console.log(`Error on ${url}: ${e.message}`);
    }
  }
}

run();
