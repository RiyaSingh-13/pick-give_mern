const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;
console.log('Connecting to database:', uri);

mongoose.connect(uri)
  .then(async () => {
    console.log('Successfully connected to MongoDB Atlas!');
    
    // Dump users
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('\n--- USERS ---');
    console.log(users.map(u => ({ id: u._id, role: u.role, fullName: u.fullName, email: u.email, officialEmail: u.officialEmail })));
    
    // Dump donations
    const donations = await mongoose.connection.db.collection('donations').find({}).toArray();
    console.log('\n--- DONATIONS ---');
    console.log(donations.map(d => ({ id: d._id, title: d.title, donor: d.donor, ngo: d.ngo, status: d.status })));
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Database Connection Error:', err);
    process.exit(1);
  });
