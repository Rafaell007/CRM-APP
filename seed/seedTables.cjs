// seedTables.cjs — run with: node seed/seedTables.cjs
// Safe to re-run: every table has a FIXED document ID, so a second run
// overwrites the same 17 docs instead of creating 17 more.

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

if (getApps().length === 0) {
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

// Tables 1-15 plus the two "A" tables from the design.
// Every table is seeded as "free" - status only ever changes through an
// action: first dish added -> occupied, waiter reserves -> reserved,
// bill paid -> free again.
const tables = [
  { id: "1", seats: 2 },
  { id: "2", seats: 2 },
  { id: "3", seats: 4 },
  { id: "4", seats: 4 },
  { id: "5", seats: 4 },
  { id: "6", seats: 2 },
  { id: "7", seats: 6 },
  { id: "8", seats: 4 },
  { id: "9", seats: 2 },
  { id: "10", seats: 4 },
  { id: "11", seats: 6 },
  { id: "12", seats: 2 },
  { id: "13", seats: 4 },
  { id: "14", seats: 4 },
  { id: "15", seats: 6 },
  { id: "A1", seats: 8 },
  { id: "A2", seats: 8 },
];

(async () => {
  const batch = db.batch();

  tables.forEach(({ id, seats }) => {
    batch.set(db.collection("tables").doc(id), {
      number: id, // string, because "A1" is not a number
      status: "free",
      reservationTime: null, // set by the waiter when reserving, e.g. "19:30"
      seats,
    });
  });

  await batch.commit();
  console.log(`Seeded ${tables.length} tables ✅`);
  process.exit(0);
})();
