import "dotenv/config";
import { app } from "./app.js";
import { connectMongo } from "./config/mongo.js";

const PORT = process.env.PORT || 4000;

async function start() {
  await connectMongo();
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
