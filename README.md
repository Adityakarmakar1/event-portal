# Event Portal

A production-ready full-stack Event Management Portal containerized with Docker and orchestrated using Docker Compose.

## Tech Stack

- **Frontend:** React + Vite (Nginx for production serving)
- **Backend:** Express.js (Node 22 Alpine)
- **Database:** MongoDB (`mongo:8`)
- **Authentication:** JWT (JSON Web Tokens) & bcryptjs
- **Containerization:** Docker (Multi-stage builds)
- **Orchestration:** Docker Compose

## Features

- **User Registration & Login:** Secure authentication with JWT.
- **Event Booking System:** Browse, view details, and book events with capacity tracking.
- **Admin Dashboard:** Manage events (Create, Update, Delete) with admin privileges.
- **Automatic Database Seeding:** Autonomous one-shot initialization of demo admin user and initial events on container startup.
- **Production-Ready Proxying:** Nginx reverse proxying for client-side API requests (`/api`).
- **Health Checks & Resilience:** Container dependency ordering (`service_healthy` & `service_completed_successfully`).

## Project Structure

```text
event-portal/
├── docker-compose.yml     # Orchestrates MongoDB, Seed, Backend, and Frontend containers
├── frontend/              # React + Vite application
│   ├── Dockerfile         # Multi-stage build (Node 22 builder -> Nginx Alpine)
│   ├── nginx.conf         # Nginx SPA fallback & /api reverse proxy config
│   └── src/               # React components, pages, context, and API client
└── backend/               # Express.js REST API
    ├── Dockerfile         # Node 22 Alpine container specification
    ├── config/            # Database connection & seed script
    ├── controllers/       # Auth, Event, and Booking business logic
    ├── middleware/        # JWT auth verification & error handling
    ├── models/            # Mongoose schemas (User, Event, Booking)
    └── server.js          # Express app entrypoint & healthcheck route
```

## Demo Credentials

- **Admin Account:** `admin@nimbus.app` / `admin123`
- **Attendee:** Register a new user account via `/register`

## Run Locally

Run the entire application stack using Docker Compose:

```bash
docker compose up --build
```

Access the applications:
- **Frontend App:** [http://localhost:3000](http://localhost:3000)
- **Backend Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

## Docker

### Stop the Application Stack

```bash
docker compose down
```

### Stop and Remove Persistent Volumes (Clean Reset)

```bash
docker compose down -v
```

### Restart Existing Containers

```bash
docker compose up
```

### Check Running Service Logs

```bash
docker compose logs -f
```

## API Overview

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/health` | Public | System health status check |
| `POST` | `/api/auth/register` | Public | User registration |
| `POST` | `/api/auth/login` | Public | User login & JWT issuance |
| `GET` | `/api/auth/me` | Authenticated | Get logged-in user profile |
| `GET` | `/api/events` | Public | List all available events |
| `POST` | `/api/events` | Admin | Create a new event |
| `PUT` | `/api/events/:id` | Admin | Update existing event details |
| `DELETE` | `/api/events/:id` | Admin | Delete an event |
| `GET` | `/api/bookings` | Authenticated | View current user's booked events |
| `POST` | `/api/bookings` | Authenticated | Reserve tickets for an event |
| `DELETE` | `/api/bookings/:id` | Authenticated | Cancel an existing booking |

## Version

`v1.0`
