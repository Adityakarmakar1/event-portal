# Nimbus — Event Management Portal

A full-stack event portal with a React + Vite frontend and Express + MongoDB backend.

## Project structure

```
event-portal/
├── frontend/          React + Vite
│   └── src/pages/     Home, Login, Register, Events, Bookings, Admin Dashboard, 404
└── backend/           Express API
    ├── controllers/
    ├── routes/
    ├── models/
    ├── middleware/
    ├── config/
    └── server.js
```

## Prerequisites

- Node.js 18+
- MongoDB running locally (default: `mongodb://localhost:27017/nimbus`)

## Getting started

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Configure the backend

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` if needed. Defaults work for local development.

### 3. Seed the database

```bash
npm run seed
```

This creates sample events and an admin account.

### 4. Run the app

In one terminal:

```bash
npm run dev:backend
```

In another terminal:

```bash
npm run dev:frontend
```

Open **http://localhost:5173**

## Demo credentials

- **Admin:** `admin@nimbus.app` / `admin123`
- **Attendee:** register a new account at `/register`

## API overview

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/auth/me` | Current user |
| GET | `/api/events` | List events |
| POST | `/api/events` | Create event (admin) |
| PUT | `/api/events/:id` | Update event (admin) |
| DELETE | `/api/events/:id` | Delete event (admin) |
| GET | `/api/bookings` | User's bookings |
| POST | `/api/bookings` | Book an event |
| DELETE | `/api/bookings/:id` | Cancel booking |

## Stack

**Frontend:** React 18, Vite 5, React Router 6  
**Backend:** Express, MongoDB, Mongoose, JWT, bcrypt
