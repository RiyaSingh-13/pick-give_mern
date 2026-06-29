const http = require('http');

const postJSON = (url, body) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const dataStr = JSON.stringify(body);
    const req = http.request({
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataStr)
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });
    req.on('error', reject);
    req.write(dataStr);
    req.end();
  });
};

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
    console.log('1. Registering Member 1 (mem1)...');
    const mem1 = await postJSON('http://localhost:5001/api/users/register', {
      role: 'Member',
      fullName: 'mem1',
      email: 'mem1@gmail.com',
      phone: '+91 99999 11111',
      location: 'Delhi',
      password: 'password123'
    });
    console.log('Member 1 Registered:', mem1);

    console.log('\n2. Registering Member 2 (mem2)...');
    const mem2 = await postJSON('http://localhost:5001/api/users/register', {
      role: 'Member',
      fullName: 'mem2',
      email: 'mem2@gmail.com',
      phone: '+91 99999 22222',
      location: 'Delhi',
      password: 'password123'
    });
    console.log('Member 2 Registered:', mem2);

    console.log('\n3. Creating donation for Member 1 (mem1)...');
    const donation = await postJSON('http://localhost:5001/api/donations', {
      title: 'Blankets',
      category: 'Bedding',
      donor: mem1.fullName,
      ngo: 'Common Pool',
      location: mem1.location,
      description: 'Warm blankets',
      instructions: 'Handle with care',
      photo: ''
    });
    console.log('Donation Created:', donation);

    console.log('\n4. Fetching all donations from backend...');
    const allDonations = await getJSON('http://localhost:5001/api/donations');
    console.log('All Donations:', allDonations);

    console.log('\n5. Emulating frontend filtering:');
    
    // Member 1 activeDonations
    const activeDonationsMem1 = allDonations.filter(d => d.donor === mem1.fullName);
    console.log(`Active Donations for Member 1 (${mem1.fullName}):`, activeDonationsMem1.map(d => ({ title: d.title, donor: d.donor })));

    // Member 2 activeDonations
    const activeDonationsMem2 = allDonations.filter(d => d.donor === mem2.fullName);
    console.log(`Active Donations for Member 2 (${mem2.fullName}):`, activeDonationsMem2.map(d => ({ title: d.title, donor: d.donor })));

  } catch (err) {
    console.error('Error during testing:', err);
  }
}

run();
