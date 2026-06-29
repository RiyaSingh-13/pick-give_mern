const User = require('./models/User');
const Donation = require('./models/Donation');
const Request = require('./models/Request');
const AuditLog = require('./models/AuditLog');

async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('ℹ️ Database already has data. Skipping automatic seeding.');
      return;
    }

    console.log('🌱 Database is empty. Seeding initial real-world configuration...');

    // 1. Seed ONLY default System Admin with password
    const users = [
      {
        role: 'Admin',
        fullName: 'System Admin',
        email: 'admin@gmail.com',
        password: 'admin123',
        phone: '+91 99999 88888',
        status: 'Approved'
      }
    ];

    await User.insertMany(users);
    console.log('✅ Seeded default System Admin account (admin@gmail.com / admin123).');

    // 2. NGO Requirements (Requests) start 100% clean
    const requests = [];
    await Request.insertMany(requests);

    // 3. Donations start 100% clean
    const donations = [];
    await Donation.insertMany(donations);

    // 4. Seed basic startup Audit Log
    const logs = [
      {
        event: 'System Registry initialized with clean configuration.',
        category: 'Auth',
        timestamp: new Date()
      }
    ];

    await AuditLog.insertMany(logs);
    console.log('✅ Seeded initial system audit log.');

    console.log('🌳 Database seeding finished successfully (clean database slate active).');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}

module.exports = seedDatabase;
