const mongoose = require('mongoose');
require('dotenv').config();

const JobRequest = require('../src/models/JobRequest');

const jobs = [
  {
    title: 'Leaking kitchen tap needs urgent repair',
    description: 'The kitchen tap has been dripping constantly for two weeks. Water is pooling under the sink and causing damage to the cabinet base.',
    category: 'Plumbing',
    location: 'Heerassagala',
    contactName: 'Kavinda Perera',
    contactEmail: 'kavinda.perera@example.com',
    status: 'Open',
  },
  {
    title: 'Bathroom toilet not flushing properly',
    description: 'The toilet cistern takes over 20 minutes to refill and the flush is very weak. Needs a new fill valve and possibly a new flush mechanism.',
    category: 'Plumbing',
    location: 'Kandy',
    contactName: 'Nishani Fernando',
    contactEmail: 'nishani.fernando@example.com',
    status: 'In Progress',
  },
  {
    title: 'Faulty consumer unit – frequent tripping',
    description: 'The main circuit breaker trips every time the washing machine and kettle are used at the same time. Needs inspection and possible upgrade.',
    category: 'Electrical',
    location: 'Colombo',
    contactName: 'Ruwan Jayasinghe',
    contactEmail: 'ruwan.jayasinghe@example.com',
    status: 'Open',
  },
  {
    title: 'Garden shed wiring and lighting installation',
    description: 'Need two plug sockets and an overhead light installed in a garden shed. The shed is roughly 8 metres from the house.',
    category: 'Electrical',
    location: 'Negombo',
    contactName: 'Dilshan Wickramasinghe',
    contactEmail: 'dilshan.w@example.com',
    status: 'Open',
  },
  {
    title: 'Full interior repaint – 3-bedroom house',
    description: 'All interior walls and ceilings need repainting. Current colour is dark green and needs to be changed to off-white throughout. Around 120 square metres total.',
    category: 'Painting',
    location: 'Galle',
    contactName: 'Sanduni Rathnayake',
    contactEmail: 'sanduni.r@example.com',
    status: 'Open',
  },
  {
    title: 'Exterior gate and wall painting',
    description: 'Front compound wall and metal gate need sanding, priming and two coats of weatherproof paint. Wall is approximately 15 metres long.',
    category: 'Painting',
    location: 'Matara',
    contactName: 'Chamara Silva',
    contactEmail: 'chamara.silva@example.com',
    status: 'Closed',
  },
  {
    title: 'Bespoke fitted wardrobes for master bedroom',
    description: 'Looking for a carpenter to design and build fitted wardrobes across a 4-metre wall in the master bedroom. Needs internal shelving, a hanging rail and soft-close doors.',
    category: 'Joinery',
    location: 'Nuwara Eliya',
    contactName: 'Thilanka Dissanayake',
    contactEmail: 'thilanka.d@example.com',
    status: 'Open',
  },
  {
    title: 'Rotten window frames – replacement needed',
    description: 'Three wooden window frames on the ground floor are badly rotted. Need full removal and replacement with new hardwood frames, including repainting.',
    category: 'Joinery',
    location: 'Jaffna',
    contactName: 'Priya Krishnaswamy',
    contactEmail: 'priya.k@example.com',
    status: 'In Progress',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await JobRequest.deleteMany({});
    console.log('🗑️  Cleared existing job requests');

    const inserted = await JobRequest.insertMany(jobs);
    console.log(`🌱 Seeded ${inserted.length} job requests successfully`);

    console.log('\nSample IDs (use these to test API endpoints):');
    inserted.forEach((job) => {
      console.log(`  [${job.status}] ${job.title.slice(0, 45)}... → ${job._id}`);
    });
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

seed();
