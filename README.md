# CareTracker

CareTracker is a three-member healthcare web application for patient queue
management, treatment plans, and care adherence.

## Member 1 Scope

- MongoDB database configuration
- User and notification schemas
- Registration, login, profile, JWT authentication, and role-based
  authorization
- React login, registration, profile, protected routing, navigation, and
  notification bell

## Project Structure

```text
backend/
  src/
    config/
    middleware/
    models/
    routes/
    server.js
frontend/
  src/
    api/
    components/
    pages/
database/
  seed.js
```

## Prerequisites

Install these applications before running the project:

- Node.js 22 or newer
- npm, included with Node.js
- A MongoDB Atlas account
- An existing Atlas database user with read/write access
- Your current IP address allowed by Atlas Network Access

The backend dependency manifest is `backend/package.json`.
The frontend dependency manifest is `frontend/package.json`.
The optional `backend/requirements.txt` file is a readable dependency and
software reference for project reports. For installation, npm always uses
`package.json`, not `requirements.txt`.

## MongoDB Atlas Setup

1. Open your existing MongoDB Atlas cluster.
2. Open **Security > Database Access**.
3. Create or reuse a database user.
4. Give the user read/write access to the CareTracker database.
5. Open **Security > Network Access**.
6. Add the development computer's current IP address.
7. Wait until network access is active.

Do not create a second cluster. MongoDB collections and databases are created
inside the existing cluster.

## Backend Environment Configuration

In `backend/`, copy `.env.example` to `.env`.

```powershell
cd D:\CareTracker\backend
Copy-Item .env.example .env
notepad .env
```

Set the values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://DATABASE_USERNAME:DATABASE_PASSWORD@YOUR_CLUSTER.mongodb.net/caretracker?retryWrites=true&w=majority
DATABASE_NAME=caretracker
JWT_SECRET=use_a_long_random_secret
FRONTEND_URL=http://localhost:5173
```

Replace `DATABASE_USERNAME` and `DATABASE_PASSWORD` with the database user's
credentials from Atlas **Database Access**. If a password contains reserved URI
characters, URL-encode them before placing it in `MONGODB_URI`.

Never commit the `.env` file or paste the database password into screenshots,
source control, or project reports.

## Backend Installation and Start

Open a new terminal:

```powershell
cd D:\CareTracker\backend
npm install
npm run dev
```

Successful startup output:

```text
MongoDB connected: caretracker
CareTracker API listening on http://localhost:5000
```

The API runs at `http://localhost:5000`.

## Create Demo Accounts

Keep the backend running and open a second terminal:

```powershell
cd D:\CareTracker\backend
npm run seed
```

The seed creates:

| Role | Email | Password |
|---|---|---|
| Patient | `patient@caretracker.local` | `CareTracker123!` |
| Receptionist | `reception@caretracker.local` | `CareTracker123!` |
| Doctor | `doctor@caretracker.local` | `CareTracker123!` |

Running the seed again resets these demo users and notifications.

## Frontend Installation and Start

Open a third terminal:

```powershell
cd D:\CareTracker\frontend
npm install
npm run dev
```

The React app runs at `http://localhost:5173`.

Port `5173` is fixed by `vite.config.js`. If it is already occupied, stop the
other process instead of allowing Vite to move the application to `5174`.

Open `http://localhost:5173/login` or
`http://localhost:5173/register`.

## Production Frontend Build

```powershell
cd D:\CareTracker\frontend
npm run build
```

The generated static files are written to `frontend/dist/`.

## Troubleshooting

### MongoDB authentication failed

- Verify `DATABASE_USERNAME` and `DATABASE_PASSWORD` in `backend/.env`.
- Use the database user credentials from Atlas **Database Access**, not the
  Atlas account email and account password.
- If the password is forgotten, edit the Atlas database user and set a new
  password.

### The frontend moves to port 5174

Port `5173` is intentionally fixed. Stop the existing process using port `5173`
and restart Vite:

```powershell
cd D:\CareTracker\frontend
npm run dev
```

### Login says Login failed

1. Confirm `npm run dev` is running in the backend terminal.
2. Open `http://localhost:5000/api/health` and verify it returns status `ok`.
3. Run `npm run seed` inside `backend/`.
4. Refresh `http://localhost:5173/login`.