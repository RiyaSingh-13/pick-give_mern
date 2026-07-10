// backend/query_api.js
const http = require('http');

const getJSON = (url) => {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
};

async function run() {
  try {
    const ping = await getJSON('http://localhost:5001/api/ping');
    console.log('Backend Ping:', ping);

    const members = await getJSON('http://localhost:5001/api/users/members');
    console.log('\n--- MEMBERS ---');
    console.log(members);

    const donations = await getJSON('http://localhost:5001/api/donations');
    console.log('\n--- DONATIONS ---');
    console.log(donations);
  } catch (err) {
    console.error('Error querying APIs:', err.message);
  }
}

run();
