import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create the database connection with correct path
const dbPath = path.resolve(__dirname, "..", "database.sqlite");
const db = new Database(dbPath);

const authConfig = {
  database: db,
  baseURL: "http://localhost:3000/api/auth",
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
  ],
};

// Create auth instance and export its handler
const authInstance = betterAuth(authConfig);

export const auth = {
  handler: authInstance.handler,
  api: authInstance.api,
};
