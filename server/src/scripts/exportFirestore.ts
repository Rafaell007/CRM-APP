import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const COLLECTIONS = ["shifts", "employees", "attendance", "tables", "users", "dishes"];

const keyFile = new URL("../../../.secrets/serviceAccountKey.json", import.meta.url);
const outputDir = new URL("./data/", import.meta.url);

initializeApp({ credential: cert(JSON.parse(readFileSync(keyFile, "utf8"))) });
const db = getFirestore();

const toPlain = (value: unknown) =>
  value instanceof Timestamp ? value.toDate().toISOString() : value;

mkdirSync(outputDir, { recursive: true });

for (const name of COLLECTIONS) {
  const snapshot = await db.collection(name).get();

  const documents = snapshot.docs.map((document) => ({
    id: document.id,
    ...Object.fromEntries(
      Object.entries(document.data()).map(([key, value]) => [key, toPlain(value)]),
    ),
  }));

  writeFileSync(new URL(`${name}.json`, outputDir), JSON.stringify(documents, null, 2));
  console.log(`${name}: ${documents.length} documents`);
}
