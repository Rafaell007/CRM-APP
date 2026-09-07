# Restaurant CRM

A staff management application for a restaurant, built with React and Firebase.
Two roles share one app: an **admin** manages employees and shifts, a **waiter**
works with tables and orders.

**Live demo:** https://crm-app-iota-one.vercel.app

---

## Functionality

### Authentication and authorization

- Email and password sign-in through Firebase Authentication
- The session survives a page refresh (the token is kept by the Firebase SDK)
- Each account has a profile document in `users/{uid}` holding its `role`
- `ProtectedRoute` blocks a route branch by role — `/admin` needs `admin`,
  `/waiter` needs `waiter`; a signed-out visitor is sent to `/login`
- Log out from the admin sidebar

> The route guards are user experience, not security. Data access is meant to be
> enforced by Firestore Security Rules.

### Admin — employees

- **Summary cards** — total staff, currently on shift, idle. Clicking a card
  filters the table below it.
- **Shifts are derived from the clock.** Nothing stores "is working now".
  A shift document holds a daily window (`"06:00"`–`"14:00"`), and the active
  shift is the one containing the current time. Windows crossing midnight are
  handled.
- **Filtering** — by shift and by status, applied as you change a select, with
  no submit button.
- **Sorting** — by employment date or billing date, newest or oldest first.
- **Search** — by employee name, in a search box that expands from its icon.
- **Responsive table** — a five-column grid on desktop; on mobile each row
  collapses and the details open with a toggle.

### Admin — analytics

A dashboard for the person running the shifts. Everything except the hours
trend is computed from the `employees` and `shifts` collections — nothing is
stored twice.

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
- **Working now** — the people on the active shift.

### Waiter

- List of tables read from Firestore (early stage)

### Layout

- Sidebar navigation on desktop
- Below 768px it becomes an off-canvas drawer with a hamburger button and an
  overlay; it closes on the overlay, the close button, or any nav link

---

## Tech stack

| Area | Choice |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Routing | React Router 8 |
| Server state | Redux Toolkit Query |
| Backend | Firebase — Authentication + Cloud Firestore |
| Icons | lucide-react |
| Styling | Plain CSS, one file per component, BEM naming |

**Why RTK Query:** every Firestore read goes through one cache, so the same data
is fetched once no matter how many components ask for it. `getEmployees` also
joins each employee with their shift document, so components receive finished
data instead of ids.

---

## Dependencies

### Runtime

| Package | Version |
|---|---|
| react | ^19.2.8 |
| react-dom | ^19.2.8 |
| react-router | ^8.3.0 |
| @reduxjs/toolkit | ^2.12.0 |
| react-redux | ^9.3.0 |
| firebase | ^12.18.0 |
| lucide-react | ^1.34.0 |

### Development

| Package | Version |
|---|---|
| vite | ^8.2.2 |
| @vitejs/plugin-react | ^6.1.0 |
| eslint | ^10.9.1 |
| @eslint/js | ^10.0.1 |
| eslint-plugin-react-hooks | ^7.1.1 |
| eslint-plugin-react-refresh | ^0.5.4 |
| globals | ^17.11.0 |
| @types/react | ^19.2.18 |
| @types/react-dom | ^19.2.4 |
| firebase-admin | ^14.3.0 (local admin scripts only) |
| vitest | ^5.0.0 |
| jsdom | ^29.1.1 |
| @testing-library/react | ^16.3.3 |
| @testing-library/jest-dom | ^7.0.1 |

---

## Getting started

### Requirements

- Node.js 18 or newer
- A Firebase project with **Authentication** (email/password) and
  **Cloud Firestore** enabled

### 1. Install

```bash
git clone https://github.com/Rafaell007/CRM-APP.git
cd CRM-APP
npm install
```

### 2. Configure Firebase

Copy the example file and fill in the values from
_Firebase Console → Project settings → Your apps_:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

`.env` is git-ignored. Only `VITE_`-prefixed variables reach the browser.

### 3. Create the collections

The app reads five collections — `users`, `shifts`, `employees`, `tables`,
`attendance`. Create them in the Firebase console following the shapes in
[Data model](#data-model) below.

At minimum you need the two shift documents, with the id used as the reference:

```
shifts/shiftA   { name: "A", startTime: "06:00", endTime: "14:00" }
shifts/shiftB   { name: "B", startTime: "14:00", endTime: "22:00" }
```

`attendance` holds one document per month and feeds the hours chart. It can be
generated with a local Admin SDK script kept in `.secrets/` — the values it
writes are synthetic (a seasonal curve, not real timesheets).

Anything written with the Firebase Admin SDK needs a service account key
(_Project settings → Service accounts → Generate new private key_). Keep it in
`.secrets/`, which is git-ignored — that key bypasses every security rule and
must never be committed or deployed.

### 4. Create the accounts

In _Authentication → Users_, add an admin and a waiter. Then in Firestore create
one document per account in the `users` collection, using the **uid as the
document id**:

```json
{
  "email": "admin@restaurant.com",
  "role": "admin",
  "displayName": "Jan Kowalski"
}
```

Valid roles: `admin`, `waiter`.

### 5. Run

```bash
npm run dev
```

Open http://localhost:5173 and sign in.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint over the project |
| `npm test` | Run the unit tests in watch mode |
| `npm run test:run` | Run the unit tests once |

---

## Project structure

```
src/
├── context/             authContext + AuthProvider
├── hooks/               useEmployeesFilter, useAnalytics
├── layouts/             AdminLayout, WaiterLayout
├── pages/
│   ├── AdminPage/
│   │   ├── AdminEmployeesPage/   page + EmployeeSummary, EmployeeList, EmployeeFilters
│   │   └── AdminAnalyticsPage/   page + AnalyticsOverview, AttendanceTrend,
│   │                             StaffSplit, ShiftCoverage, OnShiftNow
│   ├── LoginPage/
│   ├── NotFoundPage/
│   └── TableOrdersPage/          TablesPage, TableOrdersPage
├── router/              router.jsx, ProtectedRoute
├── services/            firebase.js, api.js (RTK Query endpoints)
├── store/               Redux store
└── utils/               formatDate, getActiveShift, getVisibleEmployees, getAnalytics
```

Each component folder holds its `.jsx` next to its `.css`. Unit tests sit
beside the file they cover (`getAnalytics.test.js` next to `getAnalytics.js`).

The two admin pages follow the same shape: the page fetches with RTK Query,
a hook (`useEmployeesFilter`, `useAnalytics`) turns raw collections into
finished values, and the child components only render what they are given.
All the calculation lives in pure functions under `utils/`, which is where the
tests are.

---

## Data model

```
users/{uid}         { email, role, displayName }
shifts/{shiftId}    { name, startTime, endTime }      "06:00" style, local time
employees/{id}      { name, email, avatar, shiftId,
                      employmentDate, billingDate }
tables/{id}         { number, seats, status }
dishes/{id}         { ... }
attendance/{YYYY-MM} { month, year, monthIndex, hours, absences }
```

An employee stores only `shiftId` — a reference. Neither the shift name nor an
"on shift" flag is copied onto the employee, so nothing can fall out of sync.

`attendance` is the only time-series collection: one document per month, with
the month index (`0`–`11`) stored so the chart can place it without parsing.

---

## Deployment

Deployed on **Vercel**: https://crm-app-iota-one.vercel.app

Every push to `main` triggers a new build.

Three things the host needs:

1. **The six `VITE_FIREBASE_*` variables**, set in the Vercel project settings.
   `.env` is git-ignored, so the values are entered there by hand.
2. **A rewrite to `index.html`**, in [`vercel.json`](vercel.json):

   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```

   Paths like `/admin/employees` exist only inside React Router, not as files.
   Without the rewrite, refreshing that URL returns a 404 from the server.
3. **The deployed domain added to Firebase** —
   _Authentication → Settings → Authorized domains_ — otherwise sign-in fails
   with `auth/unauthorized-domain`.

Building locally:

```bash
npm run build     # produces dist/
npm run preview   # serve that build
```

---

## Security

Access is enforced in two places, and only the second one is real security:

- **In the app** — `ProtectedRoute` hides pages by role. This is user
  experience: it keeps a waiter out of the admin screens, but it runs in the
  browser and can be bypassed.
- **In Firestore Security Rules** — these run on Google's servers and cannot be
  bypassed. The Firebase web API key is a public identifier (it ships inside the
  JavaScript bundle by design), so the rules are what actually protect the data.

The published rules read each user's `users/{uid}` document to get their role,
then:

| Collection | Read | Write |
|---|---|---|
| `users` | own document only | nobody, from the client |
| `employees` | admin | admin |
| `shifts` | any signed-in user | admin |
| `tables` | any signed-in user | any signed-in user |
| `dishes` | any signed-in user | admin |
| `attendance` | any signed-in user | nobody, from the client |

Anything not listed is denied — Firestore starts from "no". `users` is
write-blocked from the client on purpose, so nobody can promote themselves to
admin.

Verified with an unauthenticated REST request to the `employees` collection,
which returns `403 PERMISSION_DENIED`.

The Firebase Admin SDK bypasses these rules by design — that is why the service
account key is the one genuine secret in this project. It lives in `.secrets/`,
which is git-ignored, and must never be committed or deployed.

---

## Known limitations

- The on shift / idle counts and the "now" marker on the coverage bar are
  calculated on render, so they do not move by themselves when the clock passes
  a shift boundary — a refresh updates them.
- The attendance numbers behind the hours chart are generated, not recorded.
  There is no clock-in feature yet to produce real ones.
- The waiter section is still a bare list.
- Shift windows use the browser's local clock, which is fine for display but not
  something to bill on.
