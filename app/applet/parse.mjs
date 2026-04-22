import https from 'https';
import fs from 'fs';

const getUrl = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => { resolve({statusCode: res.statusCode, data}); });
  }).on('error', (err) => { reject(err); });
});

async function run() {
  const { data } = await getUrl('https://taomarketcap.com/');
  const match = data.match(/<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/);
  if (match) {
    const json = JSON.parse(match[1]);
    fs.writeFileSync('taocache.json', JSON.stringify(json.props.pageProps.dehydratedState, null, 2));
    console.log('Saved to taocache.json. Queries count:', json.props.pageProps.dehydratedState.queries.length);
  }
}
run();
