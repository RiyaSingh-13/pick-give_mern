// backend/test-db.js
const mongoose = require('mongoose');
const URI = 'mongodb+srv://riyasingh231:riya1213@cluster0.5lozjjr.mongodb.net/ngo-connect';
console.log('Connecting to database...');
mongoose.connect(URI)
  .then(() => {
    console.log('✅ Connection Success!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Connection Error:', err);
    process.exit(1);
  });
