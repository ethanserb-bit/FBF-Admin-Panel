const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Request = require('../models/Request');
const Expert = require('../models/Expert');

dotenv.config();

async function initializeDatabase() {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Request.deleteMany({}),
      Expert.deleteMany({})
    ]);
    console.log('🧹 Cleared existing data');

    // Create test experts
    const experts = await Expert.create([
      {
        userId: new mongoose.Types.ObjectId(), // Simulated user ID
        name: 'Dr. Sarah Johnson',
        specialties: ['Relationships', 'Dating', 'Communication'],
        rating: 4.9,
        responseRate: 98,
        totalResponses: 156,
        successfulResponses: 153,
        credentials: [{
          title: 'PhD in Psychology',
          institution: 'Stanford University',
          year: 2015,
          verificationStatus: 'verified'
        }]
      },
      {
        userId: new mongoose.Types.ObjectId(), // Simulated user ID
        name: 'Mark Williams',
        specialties: ['Dating Apps', 'Modern Dating', 'Online Relationships'],
        rating: 4.7,
        responseRate: 95,
        totalResponses: 89,
        successfulResponses: 85,
        credentials: [{
          title: 'Certified Relationship Coach',
          institution: 'International Coaching Federation',
          year: 2018,
          verificationStatus: 'verified'
        }]
      }
    ]);
    console.log('👥 Created test experts');

    // Create test requests
    const requests = await Request.create([
      {
        question: 'Need advice on rebuilding trust',
        content: 'My partner broke my trust recently, but I want to make it work. How do I move forward?',
        status: 'pending',
        isUrgent: true,
        category: 'Relationships',
        type: 'expert',
        userId: new mongoose.Types.ObjectId(), // Simulated user ID
      },
      {
        question: 'Dating app profile review',
        content: 'Not getting many matches. Can someone review my profile and give tips?',
        status: 'pending',
        isUrgent: false,
        category: 'Dating Apps',
        type: 'regular',
        userId: new mongoose.Types.ObjectId(),
      }
    ]);
    console.log('📝 Created test requests');

    console.log('\n✨ Database initialized successfully!');
    console.log(`Created ${experts.length} experts and ${requests.length} requests`);

  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1); // Exit with error code
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

initializeDatabase(); 