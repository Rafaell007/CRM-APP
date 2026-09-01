// seed.cjs — run once with: node seed/seed.cjs
// Needs serviceAccountKey.json (Project Settings → Service accounts → Generate new private key) next to this file
//
// WARNING: this is a REBUILD. It deletes every existing document in the
// "shifts" and "employees" collections before writing the new ones.

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({ credential: cert(serviceAccount) });
const database = getFirestore();

// ---------------------------------------------------------------------------
// Shifts — daily patterns, not moments in time.
// startTime / endTime are plain "HH:MM" strings in restaurant local time, so
// they compare correctly with a simple string comparison and carry no timezone.
// Fixed document ids, so every employee can reference one of them.
// ---------------------------------------------------------------------------
const shifts = [
  { id: "shiftA", name: "A", startTime: "06:00", endTime: "14:00" },
  { id: "shiftB", name: "B", startTime: "14:00", endTime: "22:00" },
];

// 55 distinct first + last names so generated emails never collide
const firstNames = [
  "Mina", "Pete", "Irene", "Neal", "Larry", "Jana", "Omar", "Lucia", "Dwayne", "Nina",
  "Carl", "Rosa", "Ivan", "Tina", "Hugo", "Elena", "Marco", "Sara", "Leon", "Paula",
  "Victor", "Amina", "Felix", "Greta", "Diego", "Nora", "Oscar", "Lena", "Ravi", "Maya",
  "Bruno", "Clara", "Erik", "Freya", "Gabe", "Iris", "Jonah", "Kira", "Liam", "Mona",
  "Noah", "Olga", "Pavel", "Quinn", "Rita", "Seth", "Talia", "Umar", "Vera", "Wade",
  "Xena", "Yuri", "Zoe", "Aaron", "Bella",
];
const lastNames = [
  "Tonatiuh", "Nguyen", "Nichols", "Gomez", "Carter", "Kelley", "Haddad", "Rossi", "Exum", "Park",
  "Weber", "Diaz", "Petrov", "Lawson", "Bauer", "Costa", "Bianchi", "Meyer", "Novak", "Reyes",
  "Sokolov", "Khan", "Wagner", "Schmidt", "Alvarez", "Larsen", "Fischer", "Berg", "Kapoor", "Singh",
  "Moretti", "Vogel", "Hansen", "Lindqvist", "Turner", "Walsh", "Frost", "Marin", "Doyle", "Cole",
  "Hale", "Ivanov", "Kozlov", "Ferris", "Bloom", "Grant", "Perez", "Cruz", "Stein", "Ward",
  "Ford", "Volkov", "Reed", "Blake", "Owens",
];

// 31 people on shift A, 24 on shift B, shuffled so the table is not grouped
const shiftAssignments = [
  ...Array(31).fill("shiftA"),
  ...Array(24).fill("shiftB"),
].sort(() => Math.random() - 0.5);

// random Date between two bounds
const randomDate = (startBound, endBound) =>
  new Date(startBound.getTime() + Math.random() * (endBound.getTime() - startBound.getTime()));

const employees = shiftAssignments.map((shiftId, index) => {
  const firstName = firstNames[index];
  const lastName = lastNames[index];
  // email pattern matches the mockup: first name + last initial (e.g. "minat")
  const email = `${firstName.toLowerCase()}${lastName[0].toLowerCase()}@restcrm.com`;

  return {
    name: `${firstName} ${lastName}`,
    email,
    // the only link to a shift — no shift name copied here, no onShift flag.
    // "is this person working right now" is derived from the shift time window.
    shiftId,
    // Timestamps, NOT strings — stored as real Firestore dates so they sort and query
    employmentDate: Timestamp.fromDate(
      randomDate(new Date("2020-06-01"), new Date("2021-12-31")),
    ),
    billingDate: Timestamp.fromDate(
      randomDate(new Date("2023-01-01"), new Date("2023-06-30")),
    ),
    avatar: `https://i.pravatar.cc/150?u=${email}`, // deterministic portrait per email
  };
});

// delete every document of a collection, 400 at a time (batch limit is 500)
const clearCollection = async (collectionName) => {
  const snapshot = await database.collection(collectionName).get();

  for (let offset = 0; offset < snapshot.docs.length; offset += 400) {
    const batch = database.batch();
    snapshot.docs
      .slice(offset, offset + 400)
      .forEach((document) => batch.delete(document.ref));
    await batch.commit();
  }

  return snapshot.size;
};

(async () => {
  const removedShifts = await clearCollection("shifts");
  const removedEmployees = await clearCollection("employees");
  console.log(`Removed ${removedShifts} shifts and ${removedEmployees} employees`);

  const batch = database.batch();

  shifts.forEach(({ id, ...shiftData }) => {
    batch.set(database.collection("shifts").doc(id), shiftData);
  });

  employees.forEach((employee) => {
    batch.set(database.collection("employees").doc(), employee); // auto-generated id
  });

  await batch.commit();
  console.log(`Seeded ${shifts.length} shifts and ${employees.length} employees`);
  process.exit(0);
})();
