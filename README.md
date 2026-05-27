# Student Job Portal

A full-stack campus recruitment platform built with the MERN stack and Tailwind CSS.

## Features

- 3 user roles: Student, Employer, Admin
- Job listings with smart filters (type, work mode, stipend, skills, branch)
- AI skill-based job matchmaking
- PDF resume builder (client-side, no server needed)
- Application tracker with full status pipeline
- Applicant Management System (ATS) for employers with interview scheduling
- Internal chat (polling-based, works on serverless)
- Email notifications (status updates, job matches, password reset)
- Admin panel: approve jobs, verify companies, manage users
- Resource center with career guidance links

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Node.js + Express.js (serverless-compatible)
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcryptjs
- **File Storage:** Cloudinary
- **Email:** Nodemailer
- **PDF:** jsPDF (client-side)

## Project Structure

```
student-job-portal/
├── backend/          # Express REST API
│   ├── middleware/   # JWT auth guard
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API endpoints
│   └── utils/        # Cloudinary, email, AI matching
└── frontend/         # React + Vite SPA
    └── src/
        ├── components/
        ├── context/
        ├── pages/
        └── utils/
```

## Local Setup

### Backend

```bash
cd backend
cp .env.example .env
# Fill in your values in .env
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`

## Environment Variables

See `backend/.env.example` for all required variables:

```
MONGO_URI=
JWT_SECRET=
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
CLIENT_URL=http://localhost:3000
```

Frontend needs one variable in `frontend/.env`:
```
VITE_API_URL=   # leave empty for local dev (uses Vite proxy)
```

## Create Admin Account

Register normally, then update your user in MongoDB:

```js
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin", isVerified: true } }
)
```

## Deployment

- **Frontend** → Vercel (set `VITE_API_URL` to your backend URL)
- **Backend** → Vercel (set all env variables in Vercel dashboard)
- **Database** → MongoDB Atlas (free M0 cluster)
- **Files** → Cloudinary (free tier)

## Team

Eman Shafique · Dua Jamali · Khadija · Khansa
