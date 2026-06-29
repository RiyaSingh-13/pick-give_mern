const mongoose = require('mongoose');
const URI = 'mongodb+srv://riyasingh231:riya1213@cluster0.5lozjjr.mongodb.net/ngo-connect';

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
