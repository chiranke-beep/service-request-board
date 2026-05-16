const mongoose = require('mongoose');
require('dotenv').config();

const JobRequest = require('../src/models/JobRequest');

const sampleJobs = [
  {
    title: 'Leaking kitchen tap needs urgent repair',
    description:
      'The kitchen tap has been dripping constantly for two weeks. Water bill is increasing and the sink is stained. Need a qualified plumber to fix or replace the tap.',
    category: 'Plumbing',
    location: 'Glasgow',
    contactName: 'Kavinda Perera',
    contactEmail: 'kavinda.perera@example.com',
    status: 'Open',
  },
  {
    title: 'Bathroom toilet not flushing properly',
    description:
      'The toilet cistern is not refilling after flushing. Have to manually fill it with a bucket. Looking for someone who can diagnose and fix the internal mechanism.',
    category: 'Plumbing',
    location: 'Edinburgh',
    contactName: 'Nuwan Silva',
    contactEmail: 'nuwan.silva@example.com',
    status: 'In Progress',
  },
  {
    title: 'Faulty consumer unit – frequent tripping',
    description:
      'The main consumer unit trips every time the washing machine and kettle run simultaneously. Suspect the consumer unit is outdated and needs upgrading to a modern unit with RCDs.',
    category: 'Electrical',
    location: 'Aberdeen',
    contactName: 'Dilini Fernando',
    contactEmail: 'dilini.fernando@example.com',
    status: 'Open',
  },
  {
    title: 'Garden shed wiring and lighting installation',
    description:
      'Need a qualified electrician to run a power supply from the house to a new garden shed (approximately 15 metres). Require 2 double sockets and 2 LED ceiling lights installed.',
    category: 'Electrical',
    location: 'Inverness',
    contactName: 'Chamara Jayasinghe',
    contactEmail: 'chamara.jayasinghe@example.com',
    status: 'Open',
  },
  {
    title: 'Full interior repaint – 3-bedroom flat',
    description:
      'Looking for a professional painter to repaint the entire interior of a 3-bedroom flat. Walls and ceilings in all rooms, plus woodwork. Approximate area is 120 square metres. Paint will be supplied.',
    category: 'Painting',
    location: 'Glasgow',
    contactName: 'Nethmi Rajapaksa',
    contactEmail: 'nethmi.rajapaksa@example.com',
    status: 'Open',
  },
  {
    title: 'Exterior fence painting – 20 metre run',
    description:
      'Timber garden fence needs sanding down and repainting with weatherproof exterior paint. Two coats required. Fence runs along the back and one side of the garden, approximately 20 metres total.',
    category: 'Painting',
    location: 'Dundee',
    contactName: 'Sahan Wickramasinghe',
    contactEmail: 'sahan.wickramasinghe@example.com',
    status: 'Closed',
  },
  {
    title: 'Bespoke fitted wardrobes for master bedroom',
    description:
      'Require a skilled joiner to design and build fitted wardrobes across one wall of the master bedroom (approximately 3.5m wide, floor to ceiling). Sliding doors preferred. Looking for quotes.',
    category: 'Joinery',
    location: 'Perth',
    contactName: 'Malika Bandara',
    contactEmail: 'malika.bandara@example.com',
    status: 'Open',
  },
  {
    title: 'Rotten window frames – replacement and fitting',
    description:
      'Two ground-floor wooden window frames are rotten and letting in draughts. Need a joiner to remove the old frames, supply and fit new hardwood frames, and make good the surrounding plasterwork.',
    category: 'Joinery',
    location: 'Stirling',
    contactName: 'Roshan Dissanayake',
    contactEmail: 'roshan.dissanayake@example.com',
    status: 'In Progress',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    await JobRequest.deleteMany({});
    console.log('🗑️  Cleared existing job requests');

    const inserted = await JobRequest.insertMany(sampleJobs);
    console.log(`🌱 Seeded ${inserted.length} job requests successfully`);

    console.log('\nSample IDs (use these to test API endpoints):');
    inserted.forEach((job) => {
      console.log(`  [${job.status}] ${job.title.substring(0, 50)}... → ${job._id}`);
    });
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

seed();
