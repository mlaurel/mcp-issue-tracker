# MCP Server Issue Tracker - Implementation Tasks

## Project Setup

- [x] Initialize project structure with separate frontend and backend directories
- [x] Set up package.json for both frontend and backend
- [x] Install dependencies:
  - [x] Backend: fastify, sqlite3, better-auth, cors, dotenv
  - [x] Frontend: react, shadcn/ui, tailwindcss, axios/fetch client
- [x] Create .gitignore files
- [x] Set up TypeScript configuration

## Database Setup

- [x] Create SQLite database file structure
- [x] Write SQL migration scripts for tables:
  - [x] users table
  - [x] issues table
  - [x] tags table
  - [x] issue_tags junction table
- [x] Create database initialization script
- [x] Add sample data seeding script

## Backend API Development

### Authentication Setup

- [x] Configure BetterAuth with SQLite adapter
- [x] Create auth middleware for protected routes
- [x] Implement auth routes:
  - [x] POST /auth/signup (tested and working)
  - [x] POST /auth/signin (tested and working)
  - [x] POST /auth/signout (available via BetterAuth)
  - [x] GET /auth/me (available via BetterAuth as get-session)

### API Routes - Users

- [x] GET /api/users (for assignment dropdown) - implemented and tested
- [x] Add user validation middleware - auth middleware added

### API Routes - Tags

- [x] GET /api/tags - implemented and tested
- [x] POST /api/tags - implemented with validation and duplicate prevention
- [x] DELETE /api/tags/:id - implemented with usage protection
- [x] Add tag validation (unique names) - case-insensitive uniqueness enforced

### API Routes - Issues

- [ ] GET /api/issues (with filtering query params)
- [ ] POST /api/issues
- [ ] GET /api/issues/:id
- [ ] PUT /api/issues/:id
- [ ] DELETE /api/issues/:id
- [ ] Add issue validation middleware

### API Middleware & Utils

- [ ] Error handling middleware
- [ ] Request validation middleware
- [ ] CORS configuration
- [ ] Database connection utilities

## Frontend Development

### Project Setup

- [ ] Set up React project with Vite
- [ ] Configure shadcn/ui components
- [ ] Set up Tailwind CSS
- [ ] Create routing structure with React Router

### Authentication Components

- [ ] Create AuthContext for state management
- [ ] Build SignIn component
- [ ] Build SignUp component
- [ ] Build SignOut functionality
- [ ] Add protected route wrapper

### Core Components

- [ ] Create Issue component (display card)
- [ ] Create IssueForm component (create/edit)
- [ ] Create TagBadge component
- [ ] Create StatusBadge component
- [ ] Create UserAvatar component

### Main Pages

- [ ] Build IssueList page with filtering:
  - [ ] Filter by assigned user
  - [ ] Filter by status
  - [ ] Filter by tag
  - [ ] Search functionality
- [ ] Build IssueDetail page
- [ ] Build CreateIssue page
- [ ] Build EditIssue page

### UI Features

- [ ] Add loading states
- [ ] Add error handling and toast notifications
- [ ] Implement confirmation dialogs for deletions
- [ ] Add responsive design
- [ ] Create empty states for no issues/tags

### Data Management

- [ ] Set up API client with proper error handling
- [ ] Create custom hooks for data fetching:
  - [ ] useIssues hook
  - [ ] useTags hook
  - [ ] useUsers hook
- [ ] Add optimistic updates for better UX

## Integration & Testing

- [ ] Connect frontend to backend API
- [ ] Test all CRUD operations
- [ ] Test authentication flow
- [ ] Test filtering and search
- [ ] Verify responsive design
- [ ] Test error scenarios

## Final Polish

- [ ] Add proper TypeScript types throughout
- [ ] Clean up console logs and debug code
- [ ] Add README.md with setup instructions
- [ ] Create environment variable templates
- [ ] Add basic input validation and sanitization
- [ ] Ensure proper error messages for users

## Deployment Prep

- [ ] Create production build scripts
- [ ] Set up environment configurations
- [ ] Document API endpoints
- [ ] Create database backup/restore scripts

---

**Notes for Implementation:**

- Keep UI simple and focused - no unnecessary features
- Use shadcn/ui components consistently
- Ensure proper error handling throughout
- Make the filtering intuitive and responsive
- Keep the codebase clean and well-organized
