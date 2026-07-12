# OrbitOps

OrbitOps is a MongoDB-backed asset and operations management MVP built with Next.js. It combines employee onboarding, asset registration, allocation, bookings, maintenance, transfers, notifications, activity logs, and audit-ready records in one system of record.

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- MongoDB with Mongoose
- Cookie-based server-side auth

## Features

- Public landing page with responsive product sections
- Employee-only signup flow
- One-time first Admin setup flow
- Login, logout, and protected app routes
- Role-aware admin, asset, booking, maintenance, transfer, and notification screens
- Asset categories, departments, employee directory, allocations, bookings, transfers, and maintenance requests
- Activity logging and user notifications

## Requirements

- Node.js 20.19 or newer
- npm
- MongoDB Atlas or a local MongoDB database

## Environment

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Set these values:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/orbitops
AUTH_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`AUTH_SECRET` is required in production. Use a long random value and do not commit real secrets. `.env*` files are ignored by git, while `.env.example` is kept as a safe template.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## First Admin Setup

On a fresh database, visit:

```text
/setup
```

Create the first Admin account there. After an Admin exists, `/setup` redirects to `/login`.

Important: on a publicly reachable fresh deployment, create the first Admin before sharing the app URL. Until the first Admin exists, the setup page is intentionally available so the system can be bootstrapped.

## App Routes

- `/` - landing page
- `/signup` - employee account creation
- `/login` - employee login
- `/setup` - one-time Admin bootstrap
- `/app/dashboard` - operational overview
- `/app/admin` - departments, categories, and employee directory
- `/app/assets` - asset registry, allocation, and returns
- `/app/bookings` - bookable assets and time-slot checks
- `/app/maintenance` - maintenance request tracking
- `/app/transfers` - asset transfer requests and approvals
- `/app/notifications` - user notifications
- `/logout` - clear session and return to login

## Scripts

```bash
npm run dev
npm run build
npm run start
```

Use `npm run build` before merging or deploying.

## Project Structure

```text
src/app/                  Next.js routes and app UI
src/app/components/       Landing page components
src/app/app/actions/      Server actions for protected workflows
src/app/app/components/   Shared app shell and form UI
src/lib/                  Database, auth, session, password, and activity helpers
src/models/               Mongoose models
```

## Deployment Notes

- Configure `MONGODB_URI` and `AUTH_SECRET` in the hosting provider.
- Use Node.js 20.19 or newer.
- Run `npm run build` during deployment.
- Bootstrap the first Admin on the target database before wider access.
