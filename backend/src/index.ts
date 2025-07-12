import Fastify from "fastify";
import cors from "@fastify/cors";
import { auth } from "./auth.js";
import usersRoute from "./routes/users.js";

const fastify = Fastify({
  logger: true,
});

// Register CORS
await fastify.register(cors, {
  origin: ["http://localhost:5173", "http://localhost:5174"], // Vite dev server
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
});

// Register BetterAuth routes - handle all auth endpoints
fastify.register(
  async function (fastify) {
    fastify.all("/*", async (request, reply) => {
      try {
        // Construct request URL
        const url = new URL(request.url, `http://${request.headers.host}`);

        // Convert Fastify headers to standard Headers object
        const headers = new Headers();
        Object.entries(request.headers).forEach(([key, value]) => {
          if (value) {
            const headerValue = Array.isArray(value) ? value[0] : value;
            if (typeof headerValue === "string") {
              headers.append(key, headerValue);
            }
          }
        });

        // Create Fetch API-compatible request
        const requestBody = request.body ? JSON.stringify(request.body) : null;
        const req = new Request(url.toString(), {
          method: request.method,
          headers,
          body: requestBody,
        });

        // Process authentication request
        const response = await auth.handler(req);

        // Forward response to client
        reply.status(response.status);
        response.headers.forEach((value, key) => reply.header(key, value));
        reply.send(response.body ? await response.text() : null);
      } catch (error) {
        fastify.log.error("Authentication Error:", error);
        reply.status(500).send({
          error: "Internal authentication error",
          code: "AUTH_FAILURE",
        });
      }
    });
  },
  { prefix: "/api/auth" }
);

// Test route
fastify.get("/", async function handler(request, reply) {
  return { hello: "world" };
});

// API health check
fastify.get("/api/health", async function handler(request, reply) {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Register API routes
fastify.register(usersRoute, { prefix: "/api/users" });

// Start the server
try {
  await fastify.listen({ port: 3000, host: "0.0.0.0" });
  console.log("Backend server running on http://localhost:3000");
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
