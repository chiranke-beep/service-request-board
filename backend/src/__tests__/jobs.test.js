const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

const app = require('../../src/index');
const JobRequest = require('../../src/models/JobRequest');

// ── Setup / Teardown ───────────────────────────────────────────────────────────
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clean the collection before each test for isolation
  await JobRequest.deleteMany({});
});

// ── GET /api/jobs ──────────────────────────────────────────────────────────────
describe('GET /api/jobs', () => {
  it('should return an empty array when no jobs exist', async () => {
    const res = await request(app).get('/api/jobs');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('should return all jobs', async () => {
    await JobRequest.create([
      { title: 'Fix leaking tap', description: 'Kitchen tap dripping', category: 'Plumbing' },
      { title: 'Paint living room', description: 'Two coats needed', category: 'Painting' },
    ]);

    const res = await request(app).get('/api/jobs');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('should filter jobs by category', async () => {
    await JobRequest.create([
      { title: 'Fix leaking tap', description: 'Kitchen tap dripping', category: 'Plumbing' },
      { title: 'Paint living room', description: 'Two coats needed', category: 'Painting' },
    ]);

    const res = await request(app).get('/api/jobs?category=Plumbing');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe('Plumbing');
  });

  it('should filter jobs by status', async () => {
    await JobRequest.create([
      { title: 'Fix tap', description: 'Dripping tap', category: 'Plumbing', status: 'Open' },
      { title: 'Paint fence', description: 'Two coats', category: 'Painting', status: 'Closed' },
    ]);

    const res = await request(app).get('/api/jobs?status=Open');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe('Open');
  });

  it('should search jobs by keyword in title or description', async () => {
    await JobRequest.create([
      { title: 'Leaking kitchen tap', description: 'Fix urgently', category: 'Plumbing' },
      { title: 'Paint bedroom walls', description: 'Two coats of emulsion', category: 'Painting' },
    ]);

    const res = await request(app).get('/api/jobs?search=kitchen');

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toMatch(/kitchen/i);
  });
});

// ── POST /api/jobs ─────────────────────────────────────────────────────────────
describe('POST /api/jobs', () => {
  it('should create a new job and return 201', async () => {
    const payload = {
      title: 'Fix leaking tap',
      description: 'The kitchen tap has been dripping for a week',
      category: 'Plumbing',
      location: 'Colombo',
      contactName: 'Kavinda Perera',
      contactEmail: 'kavinda.perera@example.com',
    };

    const res = await request(app).post('/api/jobs').send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(payload.title);
    expect(res.body.status).toBe('Open'); // default status
    expect(res.body._id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it('should return 400 if title is missing', async () => {
    const res = await request(app).post('/api/jobs').send({
      description: 'Missing title field',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual(expect.arrayContaining(['Title is required']));
  });

  it('should return 400 if description is missing', async () => {
    const res = await request(app).post('/api/jobs').send({
      title: 'Fix tap',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual(expect.arrayContaining(['Description is required']));
  });

  it('should return 400 for an invalid email format', async () => {
    const res = await request(app).post('/api/jobs').send({
      title: 'Fix tap',
      description: 'Kitchen tap dripping',
      contactEmail: 'not-an-email',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('should return 400 for an invalid category', async () => {
    const res = await request(app).post('/api/jobs').send({
      title: 'Fix tap',
      description: 'Kitchen tap dripping',
      category: 'InvalidCategory',
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });
});
