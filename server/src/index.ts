import { app } from "./app.ts";
import { connectDb } from "./config/db.ts";

const PORT = process.env.PORT ?? 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in server/.env");
}

await connectDb(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
