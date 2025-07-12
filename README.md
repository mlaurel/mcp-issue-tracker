# MCP Server Issue Tracker

A simple GitHub-style issue tracker built for instructing students on coding.

## Tech Stack

- **Frontend**: React.js with Vite, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Fastify API with TypeScript
- **Database**: SQLite (committed to Git)
- **Authentication**: BetterAuth

## Project Structure

```
├── backend/          # Fastify API server
│   ├── src/
│   │   └── index.ts  # Main server file
│   ├── package.json
│   └── tsconfig.json
├── frontend/         # React application
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── lib/
│   │       └── utils.ts
│   ├── package.json
│   └── tsconfig.json
└── package.json      # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Database Setup

The SQLite database is included in the repository with sample data. To reset or recreate the database:

```bash
# Run migrations (creates tables)
cd backend && npm run db:migrate

# Seed with sample data
npm run db:seed

# Inspect database contents
npm run db:inspect
```

**Sample Users:**

- `john@example.com` / `password123`
- `jane@example.com` / `password123`
- `admin@example.com` / `admin123`
- `dev@example.com` / `dev123`

### Development

Run both frontend and backend in development mode:

```bash
# From root directory
npm run dev
```

Or run them separately:

```bash
# Backend (http://localhost:3000)
npm run dev:backend

# Frontend (http://localhost:5173)
npm run dev:frontend
```

### Build

```bash
npm run build
```

## Core Features

- Issue tracking with title, description, status, assignee, and tags
- User authentication and assignment
- Arbitrary string labels/tags
- Simple status workflow (not_started → in_progress → done)
- Filtering by assignee, status, or tag

## API Endpoints

### Authentication

- `POST /auth/signup`
- `POST /auth/signin`
- `POST /auth/signout`
- `GET /auth/me`

### Issues

- `GET /api/issues` (with query params: assigned_to, status, tag)
- `POST /api/issues`
- `GET /api/issues/:id`
- `PUT /api/issues/:id`
- `DELETE /api/issues/:id`

### Tags

- `GET /api/tags`
- `POST /api/tags`
- `DELETE /api/tags/:id`

### Users

- `GET /api/users` (for assignment dropdown)

## Next Steps

Follow the implementation tasks in `TASKS.md` to complete the application.
