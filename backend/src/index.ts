import Fastify, { FastifyInstance } from "fastify";
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

export async function buildApp(
  options = { skipAuth: false }
): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: process.env.NODE_ENV !== "test",
  });

  // Add skipAuth flag to app context for routes to check
  (fastify as any).skipAuth = options.skipAuth;

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
          // Construct the full URL
          const testUrl = `http://localhost:3000${request.url}`;

          // Convert Fastify headers to Headers object
          const headers = new Headers();
          Object.entries(request.headers).forEach(([key, value]) => {
            if (value) {
              const headerValue = Array.isArray(value) ? value[0] : value;
              if (typeof headerValue === "string") {
                headers.set(key, headerValue);
              }
            }
          });

          // Ensure content-type is set for POST requests
          if (request.method === "POST" && !headers.has("content-type")) {
            headers.set("content-type", "application/json");
          }

          // Create the request object for BetterAuth
          const authRequest = new Request(testUrl, {
            method: request.method,
            headers: headers,
            body:
              request.method !== "GET" && request.method !== "HEAD"
                ? JSON.stringify(request.body)
                : null,
          });

          // Call BetterAuth handler
          const authResponse = await auth.handler(authRequest);

          // Get response text
          const responseText = await authResponse.text();

          // Set status
          reply.status(authResponse.status);

          // Copy all headers from auth response
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

  return fastify;
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const app = await buildApp();
    await app.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
