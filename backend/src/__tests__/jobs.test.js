const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../../src/index');
const JobRequest = require('../../src/models/JobRequest');

// Give MongoMemoryServer enough time to download its binary on the first CI run
jest.setTimeout(60000);

let mongoServer;
let authToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Register a test user and grab the JWT for protected route tests
  const res = await request(app).post('/api/auth/register').send({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
  authToken = res.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await JobRequest.deleteMany({});
});

describe('GET /api/jobs', () => {
  it('returns an empty array when no jobs exist', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  it('returns all jobs', async () => {
    await JobRequest.create([
      { title: 'Fix leaking tap', description: 'Kitchen tap dripping', category: 'Plumbing' },
      { title: 'Paint living room', description: 'Two coats needed', category: 'Painting' },
    ]);
    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
  });

  it('filters jobs by category', async () => {
    await JobRequest.create([
      { title: 'Fix leaking tap', description: 'Kitchen tap dripping', category: 'Plumbing' },
      { title: 'Paint living room', description: 'Two coats needed', category: 'Painting' },
    ]);
    const res = await request(app).get('/api/jobs?category=Plumbing');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].category).toBe('Plumbing');
  });

  it('filters jobs by status', async () => {
    await JobRequest.create([
      { title: 'Fix tap', description: 'Dripping tap', category: 'Plumbing', status: 'Open' },
      { title: 'Paint fence', description: 'Two coats', category: 'Painting', status: 'Closed' },
    ]);
    const res = await request(app).get('/api/jobs?status=Open');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].status).toBe('Open');
  });

  it('searches jobs by keyword in title or description', async () => {
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

describe('POST /api/jobs', () => {
  it('creates a new job and returns 201', async () => {
    const payload = {
      title: 'Fix leaking tap',
      description: 'The kitchen tap has been dripping for a week',
      category: 'Plumbing',
      location: 'Heerassagala',
      contactName: 'Kavinda Perera',
      contactEmail: 'kavinda.perera@example.com',
    };
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(payload);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(payload.title);
    expect(res.body.status).toBe('Open');
    expect(res.body._id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it('returns 400 if title is missing', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ description: 'Missing title field' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual(expect.arrayContaining(['Title is required']));
  });

  it('returns 400 if description is missing', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Fix tap' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
    expect(res.body.details).toEqual(expect.arrayContaining(['Description is required']));
  });

  it('returns 400 for an invalid email format', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Fix tap', description: 'Kitchen tap dripping', contactEmail: 'not-an-email' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 400 for an invalid category', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Fix tap', description: 'Kitchen tap dripping', category: 'InvalidCategory' });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 401 if no token is provided', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .send({ title: 'Fix tap', description: 'Kitchen tap dripping' });
    expect(res.statusCode).toBe(401);
  });
});
