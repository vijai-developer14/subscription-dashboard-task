require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Plan = require('../models/Plan');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const plans = [
  {
    name: 'Starter',
    price: 9.99,
    features: ['5 Projects', '10GB Storage', 'Email Support', 'Basic Analytics'],
    duration: 30,
  },
  {
    name: 'Pro',
    price: 29.99,
    features: ['25 Projects', '100GB Storage', 'Priority Support', 'Advanced Analytics', 'API Access'],
    duration: 30,
  },
  {
    name: 'Business',
    price: 79.99,
    features: ['Unlimited Projects', '1TB Storage', '24/7 Support', 'Full Analytics', 'API Access', 'Custom Integrations'],
    duration: 30,
  },
  {
    name: 'Enterprise',
    price: 199.99,
    features: ['Unlimited Everything', 'Dedicated Server', 'SLA Support', 'White Label', 'Custom Contracts', 'On-premise Option'],
    duration: 365,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Plan.deleteMany({});
    await Plan.insertMany(plans);
    console.log('Plans seeded');

    // Create admin user
    const existing = await User.findOne({ email: 'admin@admin.com' });
    if (!existing) {
      const hashed = await bcrypt.hash('admin123', 10);
      await User.create({ name: 'Admin', email: 'admin@admin.com', password: hashed, role: 'admin' });
      console.log('Admin user created (admin@admin.com / admin123)');
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
