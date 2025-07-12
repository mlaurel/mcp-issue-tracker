import Fastify from "fastify";
import cors from "@fastify/cors";
import { auth } from "./auth.js";
import usersRoute from "./routes/users.js";
import tagsRoute from "./routes/tags.js";
import issuesRoute from "./routes/issues.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimits } from "./middleware/rateLimit.js";
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

// Apply rate limiting to all routes except health checks
fastify.register(async function (fastify) {
  // Add rate limiting hooks
  fastify.addHook("preHandler", rateLimits.api);

  // Register BetterAuth routes - handle all auth endpoints
  fastify.register(
    async function (fastify) {
      // Add stricter rate limiting for auth routes
      fastify.addHook("preHandler", rateLimits.auth);

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
          const requestBody = request.body
            ? JSON.stringify(request.body)
            : null;
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

  // Register API routes with appropriate rate limiting
  fastify.register(async function (fastify) {
    fastify.addHook("preHandler", rateLimits.api);
    fastify.register(usersRoute, { prefix: "/api/users" });
    fastify.register(tagsRoute, { prefix: "/api/tags" });
    fastify.register(issuesRoute, { prefix: "/api/issues" });
  });
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
  console.log("Backend server running on http://localhost:3000");
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
