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
| firebase-admin | ^14.3.0 (seed scripts only) |

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

### 3. Seed the database (optional)

The scripts in `seed/` create demo data with the Firebase Admin SDK. They need a
service account key:

_Firebase Console → Project settings → Service accounts → Generate new private key_

Save it as `seed/serviceAccountKey.json` — it is git-ignored and must never be
committed.

```bash
node seed/seed.cjs        # 2 shifts + 55 employees
node seed/seedTables.cjs  # tables
node seed/seedDishes.cjs  # dishes
```

> `seed.cjs` **deletes** everything in the `shifts` and `employees` collections
> before writing. Run it only on a database you are willing to rebuild.

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

---

## Project structure

```
src/
├── app/                 Redux store
├── components/          ProtectedRoute
├── context/             AuthContext + AuthProvider
├── hooks/               useEmployeesFilter
├── layouts/             AdminLayout, WaiterLayout
├── pages/
│   ├── AdminPage/       employees page, summary, list, row, filters
│   ├── LoginPage.jsx
│   ├── NotFoundPage.jsx
│   ├── TablesPage.jsx
│   └── TableOrdersPage.jsx
├── services/            firebase.js, api.js (RTK Query endpoints)
└── utils/               formatDate, getActiveShift, getVisibleEmployees
```

---

## Data model

```
users/{uid}         { email, role, displayName }
shifts/{shiftId}    { name, startTime, endTime }      "06:00" style, local time
employees/{id}      { name, email, avatar, shiftId,
                      employmentDate, billingDate }
tables/{id}         { number, seats, status }
dishes/{id}         { ... }
```

An employee stores only `shiftId` — a reference. Neither the shift name nor an
"on shift" flag is copied onto the employee, so nothing can fall out of sync.

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

Anything not listed is denied — Firestore starts from "no". `users` is
write-blocked from the client on purpose, so nobody can promote themselves to
admin.

Verified with an unauthenticated REST request to the `employees` collection,
which returns `403 PERMISSION_DENIED`.

The seed scripts still work because the Firebase Admin SDK bypasses rules by
design — that is why `serviceAccountKey.json` is the one genuine secret in this
project and is git-ignored.

---

## Known limitations

- The on shift / idle counts are calculated on render, so they do not change by
  themselves when the clock passes a shift boundary — a refresh updates them.
- The waiter section is still a bare list.
- Shift windows use the browser's local clock, which is fine for display but not
  something to bill on.
