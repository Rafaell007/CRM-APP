// seed.cjs — run once with: node seed/seed.cjs  (after npm i -D firebase-admin)
// Needs serviceAccountKey.json (Project Settings → Service accounts → Generate new private key) next to this file

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore, Timestamp } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// 55 distinct first + last names so generated emails never collide
const firstNames = ["Mina","Pete","Irene","Neal","Larry","Jana","Omar","Lucia","Dwayne","Nina",
  "Carl","Rosa","Ivan","Tina","Hugo","Elena","Marco","Sara","Leon","Paula",
  "Victor","Amina","Felix","Greta","Diego","Nora","Oscar","Lena","Ravi","Maya",
  "Bruno","Clara","Erik","Freya","Gabe","Iris","Jonah","Kira","Liam","Mona",
  "Noah","Olga","Pavel","Quinn","Rita","Seth","Talia","Umar","Vera","Wade",
  "Xena","Yuri","Zoe","Aaron","Bella"];
const lastNames = ["Tonatiuh","Nguyen","Nichols","Gomez","Carter","Kelley","Haddad","Rossi","Exum","Park",
  "Weber","Diaz","Petrov","Lawson","Bauer","Costa","Bianchi","Meyer","Novak","Reyes",
  "Sokolov","Khan","Wagner","Schmidt","Alvarez","Larsen","Fischer","Berg","Kapoor","Singh",
  "Moretti","Vogel","Hansen","Lindqvist","Turner","Walsh","Frost","Marin","Doyle","Cole",
  "Hale","Ivanov","Kozlov","Ferris","Bloom","Grant","Perez","Cruz","Stein","Ward",
  "Ford","Volkov","Reed","Blake","Owens"];

// exactly 31 On Shift + 24 Idle, shuffled so the table isn't grouped
const shiftFlags = [...Array(31).fill(true), ...Array(24).fill(false)]
  .sort(() => Math.random() - 0.5);

// random Date between two bounds
const randomDate = (start, end) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const employees = shiftFlags.map((onShift, i) => {
  const first = firstNames[i];
  const last = lastNames[i];
  // email pattern matches your mockup: firstname + last initial (e.g. "minat")
  const email = `${first.toLowerCase()}${last[0].toLowerCase()}@restcrm.com`;
  return {
    name: `${first} ${last}`,
    email,
    shift: Math.random() < 0.5 ? "A" : "B",                     // "A" or "B" only
    // Timestamps, NOT strings — stored as real Firestore dates so you can sort/query them
    employmentDate: Timestamp.fromDate(
      randomDate(new Date("2020-06-01"), new Date("2021-12-31"))),
    billingDate: Timestamp.fromDate(
      randomDate(new Date("2023-01-01"), new Date("2023-06-30"))),
    onShift,                                                     // drives your On Shift / Idle counts
    avatar: `https://i.pravatar.cc/150?u=${email}`,             // portrait photo, deterministic per email
  };
});

// write all 55 in a single batch (batch limit is 500, so this fits easily)
(async () => {
  const batch = db.batch();
  employees.forEach((emp) => {
    const ref = db.collection("employees").doc();  // auto-generated ID, as your spec wants
    batch.set(ref, emp);
  });
  await batch.commit();
  console.log(`Seeded ${employees.length} employees ✅`);
  process.exit(0);
})();