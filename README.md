# FixDesk Service Request Board

A small web app where homeowners can post trade job requests (plumbing, electrical, painting, etc.) and tradespeople can browse open jobs, view the details, and mark them as in progress or closed.

Built for the GlobalTNA Full-Stack Developer Intern assessment.

---

## Live URLs

Frontend: https://service-request-board-psi.vercel.app  
Backend API: https://fixdesk-api-y013.onrender.com

> Note: The backend is hosted on Render’s free tier, so the first request after inactivity may take around 30–60 seconds to wake up.

---

## Tech Stack

### Frontend
- Next.js 16 (App Router)
- Tailwind CSS
- TypeScript

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Authentication
- JWT Authentication
- Register/Login
- Protects POST and DELETE routes

### Testing
- Jest
- Supertest
- mongodb-memory-server

---

# Getting Started Locally

You’ll need:
- Node.js 18+
- MongoDB Atlas connection string

---

## 1. Clone the Repository

```bash
git clone https://github.com/chiranke-beep/service-request-board.git
cd service-request-board
```

---

## 2. Backend Setup
Install dependencies:
```bash
cd backend
npm install
```
Create .env file:
```bash
cp .env.example .env
```
Add the following values:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=pick_any_long_random_string
FRONTEND_URL=http://localhost:3000
```
Run backend:
```bash
npm run dev
```
Backend runs on:
```
http://localhost:5000
```

---

## 3. Frontend Setup
Open a new Terminal:
```bash
cd frontend
npm install
```
Create .env.local inside the frontend folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```
Run frontend:
```bash
npm run dev
```
Frontend runs on:
```
http://localhost:3000
```

---

## 4. Seed Sample Data (Optional)
```bash
cd backend
npm run seed
```
This inserts 8 sample trade job requests into the database.


---

# API Reference

| Method | Endpoint             | Auth Required | Description                                                 |
| ------ | -------------------- | ------------- | ----------------------------------------------------------- |
| GET    | `/api/jobs`          | No            | Get all jobs. Supports `?category=`, `?status=`, `?search=` |
| GET    | `/api/jobs/:id`      | No            | Get a single job                                            |
| POST   | `/api/jobs`          | Yes           | Create a new job                                            |
| PATCH  | `/api/jobs/:id`      | No            | Update job status                                           |
| DELETE | `/api/jobs/:id`      | Yes           | Delete a job                                                |
| POST   | `/api/auth/register` | No            | Register a new account                                      |
| POST   | `/api/auth/login`    | No            | Login and receive JWT                                       |


---

# Running Tests
```bash
cd backend
npm test
```
The test suite uses mongodb-memory-server, so no real MongoDB connection is required.

### Test Coverage
- Filtering
- Keyword search
- Validation errors
- Authentication protection
Total: 11 tests

---

# Application Screens
| Screen      | Route       | Description                         |
| ----------- | ----------- | ----------------------------------- |
| Home        | `/`         | Job listings, filters, search       |
| New Request | `/new`      | Create a new job request            |
| Job Detail  | `/jobs/:id` | Full job details and status updates |
| Login       | `/login`    | User sign in                        |
| Register    | `/register` | Create an account                   |


---


# Features
- Create and browse trade job requests
- Filter jobs by category and status
- Search jobs by keyword
- View detailed job information
- Update job status
- JWT-based authentication
- Protected routes for creating/deleting jobs
- Responsive UI
- RESTful API architecture
- Automated backend testing

---

# Future Improvements
- Role-based access control
- Real-time updates
- Image uploads for job requests
- Pagination
- Email notifications
- User profiles and dashboards

---

# Author
Developed by Chiran Weerasekara for the GlobalTNA Full-Stack Developer Intern Assessment.
