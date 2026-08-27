// seedDishes.cjs — run with: node seed/seedDishes.cjs
// Safe to re-run: each dish has a FIXED slug document ID, so a second run
// overwrites the same docs instead of creating duplicates.
//
// price is stored in CENTS as an integer (1250 = 12.50).
// Never store money as a float - 0.1 + 0.2 !== 0.3 in JavaScript.

const { initializeApp, cert, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");

if (getApps().length === 0) {
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

// Exactly these 4 category strings - the Order page groups by them.
const dishes = [
  { id: "bruschetta", name: "Bruschetta", category: "appetizer", price: 750 },
  { id: "caesar-salad", name: "Caesar Salad", category: "appetizer", price: 950 },
  { id: "garlic-bread", name: "Garlic Bread", category: "appetizer", price: 550 },
  { id: "soup-of-the-day", name: "Soup of the Day", category: "appetizer", price: 690 },

  { id: "grilled-salmon", name: "Grilled Salmon", category: "main", price: 2450 },
  { id: "ribeye-steak", name: "Ribeye Steak", category: "main", price: 3200 },
  { id: "margherita-pizza", name: "Margherita Pizza", category: "main", price: 1450 },
  { id: "pasta-carbonara", name: "Pasta Carbonara", category: "main", price: 1650 },

  { id: "still-water", name: "Still Water", category: "drinks", price: 350 },
  { id: "espresso", name: "Espresso", category: "drinks", price: 420 },
  { id: "house-red-wine", name: "House Red Wine", category: "drinks", price: 890 },
  { id: "craft-lager", name: "Craft Lager", category: "drinks", price: 650 },

  { id: "tiramisu", name: "Tiramisu", category: "dessert", price: 780 },
  { id: "chocolate-fondant", name: "Chocolate Fondant", category: "dessert", price: 850 },
  { id: "lemon-sorbet", name: "Lemon Sorbet", category: "dessert", price: 620 },
];

(async () => {
  const batch = db.batch();

  dishes.forEach(({ id, name, category, price }) => {
    batch.set(db.collection("dishes").doc(id), {
      name,
      category,
      price,
      // deterministic placeholder image - same slug always gives the same picture
      image: `https://picsum.photos/seed/${id}/300/200`,
    });
  });

  await batch.commit();
  console.log(`Seeded ${dishes.length} dishes ✅`);
  process.exit(0);
})();
