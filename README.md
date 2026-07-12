# OrbitOps

OrbitOps is an asset and resource operations app for organizations that need one place to track equipment, rooms, vehicles, shared resources, assignments, bookings, maintenance, transfers, audits, notifications, and activity history.

The app supports multiple organizations in the same installation. Each organization has its own Admin account, employee directory, departments, categories, assets, workflows, and reports.

## Tech Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- PostgreSQL with `pg`
- Cookie-based server-side auth

## Features

- Public landing page with responsive product sections.
- Organization setup flow for creating a new workspace and its first Admin.
- Employee signup flow where users choose an existing organization.
- Login, logout, password reset request, and protected app routes.
- Role-aware navigation and permissions.
- Asset registry with categories, departments, status, condition, location, images, and documents.
- Asset allocation and return workflows.
- Bookable assets and resource booking checks.
- Maintenance requests with priority, status, technician assignment, notes, and attachments.
- Transfer request and approval workflow.
- Audit cycles, audit items, discrepancy tracking, and audit closure.
- Activity logs and in-app notifications.
- Reports for utilization, maintenance, allocations, and bookings.

## Roles

- `Admin` manages organization setup, departments, categories, employee roles, and all asset workflows.
- `Asset Manager` manages assets, allocations, bookings, maintenance, transfers, audits, and reports.
- `Department Head` can participate in workflow approvals where applicable.
- `Employee` can sign up, log in, book resources, raise maintenance requests, request transfers, and view relevant operational data.

Admins cannot demote or deactivate their own account from the Admin screen, which prevents losing access to organization management.

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

## Core Workflows

1. Create an organization from `/setup`.
2. Log in as the organization Admin.
3. Add departments and asset categories from `/app/admin`.
4. Register assets from `/app/assets`.
5. Create employee accounts from `/signup`.
6. Promote employees or assign departments from `/app/admin`.
7. Allocate assets, book resources, raise maintenance requests, request transfers, and run audits from the app modules.

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
