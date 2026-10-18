# Restaurant CRM

A staff management application for a restaurant: a React + TypeScript frontend
and its own Node.js + Express + MongoDB backend. Two roles share one app: an
**admin** manages employees and shifts, a **waiter** works with tables and
orders.

**Demo accounts** (created by the seed script):

| Role | Email | Password |
| ---- | ----- | -------- |
| Admin | `admin@restaurant.com` | `admin` |
| Waiter | `waiter@restaurant.com` | `admin` |

**Live demo:** https://crm-app-iota-one.vercel.app

> The API runs on a free Render instance that sleeps after 15 minutes without
> traffic — the first sign-in after a break can take about a minute.

---

## Functionality

### Authentication and authorization

- Email and password sign-in against the app's own API (`POST /api/auth/login`)
- Passwords are stored only as **bcrypt hashes**
- A successful login sets a **JWT in an httpOnly cookie** (8 hours); the
  browser sends it with every request, and JavaScript cannot read it
- The session survives a page refresh — on start the app asks
  `GET /api/auth/me` who is signed in
- Route guards (`beforeLoad` in TanStack Router) send each role to its own
  section — `/admin` needs `admin`, `/waiter` needs `waiter`; a signed-out
  visitor is sent to `/login`
- Log out from the admin sidebar (`POST /api/auth/logout` clears the cookie)

> The route guards are user experience, not security. The data is protected on
> the server — see [Security](#security).

### Admin — employees

- **Summary cards** — total staff, currently on shift, idle. Clicking a card
  filters the table below it.
- **Shifts are derived from the clock.** Nothing stores "is working now".
  A shift holds a daily window (`"06:00"`–`"14:00"`), and the active shift is
  the one containing the current time. Windows crossing midnight are handled.
- **Filtering** — by shift and by status, applied as you change a select, with
  no submit button.
- **Sorting** — by employment date or billing date, newest or oldest first.
- **Search** — by employee name, in a search box that expands from its icon.
- **Reusable `DataTable`** — a generic table: pages pass the columns and rows as
  props. The rows scroll inside the table while the toolbar and the column
  header stay visible. On mobile each row collapses to a card and the details
  open with a toggle.

### Admin — analytics

A dashboard for the person running the shifts. Everything except the hours
trend is computed from employees and shifts — nothing is stored twice.

- **Overview cards** — total staff, on shift now (with the idle count), hours
  this month, average tenure.
- **Staff hours per month** — a two-line chart, this year against last year,
  with a percentage change badge for the current month. Hand-written SVG, no
  chart library.
- **Staff per shift** — a donut showing how the team is split, plus a slice for
  anyone without a shift.
- **Coverage today** — every shift drawn on a 24-hour bar with its headcount, a
  marker at the current time, and the number of hours nobody covers. Shifts
  that cross midnight are split into two blocks.
- **Working now** — the people on the active shift (the same `DataTable`).

### Waiter

- List of tables (early stage)

### Chat

- A chat widget on every page while signed in, over a browser `WebSocket`
  (connected to a public echo server, so it answers with your own message)

### Layout

- Sidebar navigation on desktop
- Below 768px it becomes an off-canvas drawer with a hamburger button and an
  overlay; it closes on the overlay, the close button, or any nav link

---

## Tech stack

| Area | Choice |
|---|---|
| Frontend | React 19, TypeScript (strict) |
| Build tool | Vite 8 (dev proxy `/api` → the server) |
| Routing | TanStack Router (code-based, type-checked links) |
| Server state | TanStack Query |
| Styling | Tailwind CSS v4 with design tokens in `@theme` |
| Icons | lucide-react |
| Tests | Vitest + Testing Library |
| Backend | Node.js 24 + Express 5, TypeScript run directly by Node |
| Database | MongoDB Atlas + Mongoose |
| Auth | bcryptjs + jsonwebtoken, JWT in an httpOnly cookie |

**How one request travels:**

```
React useQuery → fetch("/api/employees") → Vite proxy → Express
  → requireAuth → requireRole("admin") → route → Employee.find() → MongoDB
  → JSON → React
```

The browser never talks to the database — only the server does. The server
joins each employee with their shift (`populate`), sends `id` instead of
Mongo's `_id`, and dates as ISO strings, so the frontend receives finished data.

**Why TanStack Query:** every read goes through one cache, so the same data is
fetched once no matter how many components ask for it, and every page gets the
same `data` / `isPending` / `error` states.

---

## Getting started

### Requirements

- Node.js 24 or newer (the server runs `.ts` files directly)
- A MongoDB database — a free **MongoDB Atlas** cluster works. In Atlas, add
  your IP address under _Security → Network Access_.

### 1. Install

```bash
git clone https://github.com/Rafaell007/CRM-APP.git
cd CRM-APP
npm install
cd server
npm install
```

### 2. Configure the server

```bash
cd server
cp .env.example .env
```

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@your-cluster.mongodb.net/crm
PORT=3000
SEED_PASSWORD=admin
JWT_SECRET=a-long-random-string
```

Generate a real `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

`server/.env` is git-ignored. The frontend needs no `.env`.

### 3. Load the demo data

```bash
cd server
npm run seed
```

The seed empties the database and loads `server/src/scripts/data/*.json`
(shifts, employees, attendance, tables, users, dishes). Both demo users get
`SEED_PASSWORD` as their password, stored as a bcrypt hash.

### 4. Run

Two terminals:

```bash
# terminal 1 — the API on http://localhost:3000
cd server
npm run dev

# terminal 2 — the React app on http://localhost:5173
npm run dev
```

Open **http://localhost:5173** and sign in with a demo account. (Port 3000 is
the API only — opening it in the browser shows "Cannot GET /".)

---

## Scripts

Frontend (project root):

| Command | Description |
|---|---|
| `npm run dev` | Start Vite with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Run ESLint over the project |
| `npm test` | Run the unit tests in watch mode |
| `npm run test:run` | Run the unit tests once |

Server (`server/`):

| Command | Description |
|---|---|
| `npm run dev` | Start the API, restart on file changes |
| `npm run seed` | Reset the database and load the demo data |
| `npm test` | Run the API tests in watch mode |
| `npm run test:run` | Run the API tests once |

The API tests (Vitest + supertest) start a throwaway in-memory MongoDB
(`mongodb-memory-server`), so they never touch the real database. They cover
login, `/me`, logout, forged / expired tokens and the access rules of every
route.

---

## API

All routes are under `/api`. Errors are JSON: `{ "message": "..." }`.

| Method | Path | Access | Returns |
|---|---|---|---|
| GET | `/api/health` | open | `{ status: "ok" }` |
| POST | `/api/auth/login` | open | the user; sets the cookie |
| GET | `/api/auth/me` | signed in | the current user |
| POST | `/api/auth/logout` | open | `204`; clears the cookie |
| GET | `/api/shifts` | admin | all shifts |
| GET | `/api/shifts/:id` | admin | one shift, or `404` |
| GET | `/api/employees` | admin | employees with their `shift` |
| GET | `/api/attendance` | admin | monthly hours |
| GET | `/api/tables` | signed in | all tables |

Status codes: `400` bad input, `401` not signed in (or a bad / expired token),
`403` signed in but the wrong role, `404` not found, `500` server error.

---

## Project structure

```
src/                       frontend
├── api/
│   ├── http/              client.ts (fetch + ApiError), fetchers.ts, auth.ts
│   └── queries.ts         TanStack queryOptions
├── components/            Collapse, DataTable/ (generic table)
├── context/               authContext + AuthProvider
├── features/chat/         the chat widget (components, hooks, utils)
├── layouts/               RootLayout, AdminLayout, WaiterLayout
├── lib/                   queryClient
├── pages/
│   ├── AdminPage/         AdminEmployeesPage/, AdminAnalyticsPage/, employeeColumns
│   ├── WaiterPage/        TablesPage, TableOrdersPage
│   ├── LoginPage.tsx
│   └── NotFoundPage.tsx
├── router/                router.tsx (route tree + guards)
├── test/                  test data factories
├── types/                 models.ts (shared types)
└── utils/                 formatDate, getActiveShift, getStaffCounts

server/src/                backend
├── index.ts               connect to MongoDB, then listen
├── app.ts                 middleware + routes (and who may use them)
├── config/                db.ts (connection, JSON shape), auth.ts (JWT + cookie)
├── middleware/            requireAuth, requireRole, notFound, errorHandler
├── models/                Shift, Employee, Attendance, Table, User, Dish
├── routes/                auth, shifts, employees, attendance, tables
└── scripts/               seed.ts + data/*.json
```

Hooks and utils used by only one page live in that page's folder; code shared
by several pages lives in the top-level `utils/` and `types/`. Unit tests sit
beside the file they cover.

The data layer is layered: pages call `useQuery(employeesQuery)` →
`queries.ts` → `api/http/fetchers.ts` → `api/http/client.ts` → the server.
Replacing Firebase with the own backend only changed the bottom layer.

---

## Data model

MongoDB collections (Mongoose models in `server/src/models/`):

```
users        { email, displayName, role, passwordHash }   role: admin | waiter
shifts       { name, startTime, endTime }                 "06:00" style, local time
employees    { name, email, avatar, shiftId → shifts,
               employmentDate, billingDate }
tables       { number, seats, status, reservationTime }   status: free | reserved | occupied
attendance   { month, year, monthIndex, hours, absences }
dishes       { name, category, price, image }             not used by the frontend yet
```

An employee stores only `shiftId` — a real reference to a shift. Neither the
shift name nor an "on shift" flag is copied onto the employee, so nothing can
fall out of sync; the API adds the shift with `populate`.

`passwordHash` is hidden from every query by default (`select: false`) and
never leaves the server.

---

## Deployment

```
browser → Vercel (React build) ──rewrite /api/*──► Render (Express) → MongoDB Atlas
```

- **Frontend — Vercel:** every push to `main` builds the app (`npm run build`)
  and publishes `dist/`.
- **API — Render** (free web service, region Frankfurt): root directory
  `server`, build command `npm install`, start command `npm start`
  (`node src/index.ts`; `engines` in `server/package.json` asks for Node 24+).
  Environment variables are set in Render, not in a file: `MONGODB_URI`,
  `JWT_SECRET` (its own, not the local one) and `NODE_ENV=production`, which
  turns on the `Secure` cookie. Render redeploys on every push too.
- **Database — MongoDB Atlas:** Render's free instances have no fixed IP, so
  Network Access allows `0.0.0.0/0`; the strong database password is the lock.
- **[`vercel.json`](vercel.json)** joins the two:

  ```json
  {
    "rewrites": [
      { "source": "/api/(.*)", "destination": "https://crm-api-schx.onrender.com/api/$1" },
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

  The first rule forwards API calls to Render, like the Vite proxy does in
  development. The browser only ever talks to the Vercel domain, so there is
  no CORS and the auth cookie belongs to that domain. The second rule sends
  every other path to `index.html`, because routes like `/admin/employees`
  exist only inside the React router. Order matters — the first matching rule
  wins.

---

## Security

Access is checked in two places, and only the second one is real security:

- **In the app** — the route guards hide pages by role. This is user
  experience: it runs in the browser and can be bypassed.
- **On the server** — every data route is behind middleware that cannot be
  skipped from the browser:
  - `requireAuth` reads the cookie and verifies the JWT signature and expiry
    with `JWT_SECRET` → otherwise `401`
  - `requireRole("admin")` checks the role from the token → otherwise `403`

Other details:

- Passwords: bcrypt hashes (salted, 10 rounds); a wrong email and a wrong
  password get the same `401` message, so emails cannot be guessed.
- The token is signed, not secret — editing its payload (e.g. `role` →
  `admin`) breaks the signature and the server rejects it.
- The cookie is `httpOnly` (no JavaScript access), `SameSite=Lax`, and `Secure`
  in production.
- Login input is type-checked, so objects like `{ "$gt": "" }` cannot reach a
  database query.
- Secrets (`MONGODB_URI`, `JWT_SECRET`, `SEED_PASSWORD`) live only in
  `server/.env`, which is git-ignored.

---

## Known limitations

- The free API instance sleeps when idle, so the first request after a break
  is slow.
- The API is read-only for now — there are no create / edit routes.
- `apiFetch<T>` trusts the server's response shape; there is no runtime
  validation of responses yet.
- The on shift / idle counts and the "now" marker on the coverage bar are
  calculated on render, so they do not move by themselves when the clock passes
  a shift boundary — a refresh updates them.
- The attendance numbers behind the hours chart are generated, not recorded.
  There is no clock-in feature yet to produce real ones.
- The waiter section is still a bare list.
- Shift windows use the browser's local clock, which is fine for display but not
  something to bill on.
