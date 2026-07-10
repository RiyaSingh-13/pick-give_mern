// backend/query_users.js
const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.MONGODB_URI;

if (!URI) {
  console.error('❌ MONGODB_URI is not defined in .env file.');
  process.exit(1);
}

mongoose.connect(URI)
  .then(async () => {
    console.log('Connected to DB. Querying users...');
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('All Users:');
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error('Connection Error:', err);
    process.exit(1);
  });
