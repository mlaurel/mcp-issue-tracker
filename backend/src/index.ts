import Fastify from "fastify";
import cors from "@fastify/cors";
import { auth } from "./auth.js";
import usersRoute from "./routes/users.js";
import tagsRoute from "./routes/tags.js";
import issuesRoute from "./routes/issues.js";
import { errorHandler } from "./middleware/errorHandler.js";
import {
  healthCheckHandler,
  readinessCheckHandler,
  livenessCheckHandler,
} from "./utils/health.js";

const fastify = Fastify({
  logger: true,
});

// Register error handler first
fastify.setErrorHandler(errorHandler);

// Register CORS
await fastify.register(cors, {
  origin: ["http://localhost:5173", "http://localhost:5174"], // Vite dev server
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
});

// Register BetterAuth routes
fastify.register(
  async function (fastify) {
    // Create a more direct BetterAuth integration
    fastify.all("/*", async (request, reply) => {
      try {
        // Create a test request to see what BetterAuth expects
        const testUrl = `http://localhost:3000${request.url}`;

        // Try to create the request object
        const authRequest = new Request(testUrl, {
          method: request.method,
          headers: {
            "content-type": "application/json",
            ...request.headers,
          } as any,
          body: request.body ? JSON.stringify(request.body) : null,
        });

        // Call BetterAuth handler directly
        const authResponse = await auth.handler(authRequest);

        // If we get back text content, log it
        const responseText = authResponse.body
          ? await authResponse.text()
          : null;

        // Set status
        reply.status(authResponse.status);

        // Copy headers
        authResponse.headers.forEach((value, key) => {
          reply.header(key, value);
        });

        // Send response
        reply.send(responseText);
      } catch (error) {
        console.error("Auth error:", error);
        reply.status(500).send({
          error: "Authentication error",
          code: "AUTH_ERROR",
          details: error instanceof Error ? error.message : "Unknown error",
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

// Register API routes
fastify.register(async function (fastify) {
  fastify.register(usersRoute, { prefix: "/api/users" });
  fastify.register(tagsRoute, { prefix: "/api/tags" });
  fastify.register(issuesRoute, { prefix: "/api/issues" });
});

// Health check endpoints (no rate limiting)
fastify.get("/health", healthCheckHandler);
fastify.get("/health/ready", readinessCheckHandler);
fastify.get("/health/live", livenessCheckHandler);

// Legacy health check for backward compatibility
fastify.get("/api/health", async function handler(request, reply) {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// Start the server
try {
  await fastify.listen({ port: 3000, host: "0.0.0.0" });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
