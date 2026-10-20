import { app } from "./app.ts";
import { connectDb } from "./config/db.ts";
import { MONGODB_URI, PORT } from "./config/env.ts";

await connectDb(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
