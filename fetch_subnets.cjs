import https from 'https';

const getUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
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
  'https://api.taostats.io/api/v1/subnets',
  'https://api.taostats.io/subnets'
];

async function run() {
  for (const url of urls) {
    try {
      const { statusCode, data } = await getUrl(url);
      console.log(`URL: ${url} - Status: ${statusCode}`);
      if (statusCode === 200) {
        console.log(`Success! Data preview: ${data.substring(0, 200)}`);
        break;
      }
    } catch (e) {
      console.log(`Error on ${url}: ${e.message}`);
    }
  }
}

run();
