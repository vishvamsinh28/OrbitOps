# OrbitOps

OrbitOps is a PostgreSQL-backed asset and operations management MVP built with Next.js. It combines employee onboarding, asset registration, allocation, bookings, maintenance, transfers, notifications, activity logs, and audit-ready records in one system of record.

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- PostgreSQL with `pg`
- Cookie-based server-side auth

## Features

- Public landing page with responsive product sections
- Employee-only signup flow
- Organization setup flow that creates a workspace and its first Admin
- Login, logout, and protected app routes
- Role-aware admin, asset, booking, maintenance, transfer, audit, report, and notification screens
- Asset categories, departments, employee directory, allocations, bookings, transfers, and maintenance requests
- Audit cycles, discrepancy reports, activity logging, user notifications, and exportable operational reports

## Requirements

- Node.js 20.19 or newer
- npm
- PostgreSQL, such as a local Homebrew Postgres service

## Environment

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Set these values:

```bash
DATABASE_URL=postgres://localhost:5432/orbitops
AUTH_SECRET=replace-with-a-long-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

`AUTH_SECRET` is required in production. Use a long random value and do not commit real secrets. `.env*` files are ignored by git, while `.env.example` is kept as a safe template.

## Local Uploads

Asset images, asset documents, and maintenance attachments can be uploaded from the app. Files are stored under:

```text
public/uploads/
```

Only the generated `/uploads/...` URL is stored in PostgreSQL. Uploaded files are ignored by git via `.gitignore`.

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

## Organization Setup

To create a new organization/workspace, visit:

```text
/setup
```

Create the organization and its first Admin account there. `/setup` remains available so separate groups can create separate workspaces in the same deployment.

Normal `/signup` creates Employee accounts only. Employees choose the organization they are joining; Admins promote roles from `/app/admin`.

## App Routes

- `/` - landing page
- `/signup` - employee account creation
- `/forgot-password` - employee reset request workflow
- `/login` - employee login
- `/setup` - create a new organization and first Admin
- `/app/dashboard` - operational overview
- `/app/admin` - departments, categories, and employee directory
- `/app/assets` - asset registry, allocation, and returns
- `/app/bookings` - bookable assets and time-slot checks
- `/app/maintenance` - maintenance request tracking
- `/app/transfers` - asset transfer requests and approvals
- `/app/audits` - audit cycle creation and discrepancy tracking
- `/app/reports` - utilization, maintenance, allocation, and booking reports
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
src/lib/data.js           PostgreSQL query helpers
```

## Deployment Notes

- Configure `DATABASE_URL` and `AUTH_SECRET` in the hosting provider.
- Use Node.js 20.19 or newer.
- Run `npm run build` during deployment.
- Create each organization through `/setup`; normal signup joins an existing organization as an Employee.
