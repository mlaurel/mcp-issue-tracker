import { FastifyInstance } from "fastify";
import { testDb } from "./setup.js";

export const createTestUser = async (userData = {}) => {
  const defaultUser = {
    id: "test-user-1",
    email: "test@example.com",
    name: "Test User",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const user = { ...defaultUser, ...userData };

  await testDb.run(
    "INSERT INTO user (id, email, name, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
    [user.id, user.email, user.name, user.createdAt, user.updatedAt]
  );

  return user;
};

export const createTestDbUser = async (userData = {}) => {
  const defaultUser = {
    name: "Test User",
    email: "test@example.com",
  };

  const user = { ...defaultUser, ...userData };

  const result = await testDb.run(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    [user.name, user.email]
  );

  return { ...user, id: result.lastID };
};

export const createTestTag = async (tagData = {}) => {
  const defaultTag = {
    name: "test-tag",
    color: "#3b82f6",
  };

  const tag = { ...defaultTag, ...tagData };

  const result = await testDb.run(
    "INSERT INTO tags (name, color) VALUES (?, ?)",
    [tag.name, tag.color]
  );

  return { ...tag, id: result.lastID };
};

export const createTestIssue = async (issueData = {}) => {
  const defaultIssue = {
    title: "Test Issue",
    description: "Test Description",
    status: "not_started",
    priority: "medium",
    assigned_user_id: null,
    created_by_user_id: "test-user-1", // Use BetterAuth user ID format
  };

  const issue = { ...defaultIssue, ...issueData };

  const result = await testDb.run(
    "INSERT INTO issues (title, description, status, created_by_user_id, assigned_user_id, priority) VALUES (?, ?, ?, ?, ?, ?)",
    [
      issue.title,
      issue.description,
      issue.status,
      issue.created_by_user_id,
      issue.assigned_user_id,
      issue.priority,
    ]
  );

  return { ...issue, id: result.lastID };
};

export const mockAuthenticatedRequest = (
  app: FastifyInstance,
  userId: string = "test-user-1"
) => {
  // Override the authMiddleware for tests by replacing it with a mock version
  app.decorateRequest("user", null);

  // Add a preHandler hook that runs early to set the user context
  app.addHook("onRequest", async (request, reply) => {
    // Skip auth for API routes in tests and set mock user
    if (
      request.url.startsWith("/api/") &&
      !request.url.startsWith("/api/auth")
    ) {
      (request as any).user = {
        id: userId,
        email: "test@example.com",
        name: "Test User",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  });
};
