import "dotenv/config";
import app from "./app.js";
import { ensureDatabaseUpdates } from "./config/db.js";


const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  await ensureDatabaseUpdates();
  app.listen(PORT, () =>
    console.log(`Brewly API running on http://localhost:${PORT}`),
  );
}

startServer().catch((error) => {
  console.error("Could not start Brewly API:", error);
  process.exit(1);
});
