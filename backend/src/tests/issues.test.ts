import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildApp } from "../index.js";
import {
  createTestDbUser,
  createTestTag,
  createTestIssue,
  createTestUser,
  mockAuthenticatedRequest,
} from "./helpers.js";
import { FastifyInstance } from "fastify";
import "./setup.js"; // This runs the setup hooks

describe("Issues API", () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildApp({ skipAuth: true });

    // Create a test user for our tests in both tables
    await createTestDbUser({ name: "Test User", email: "test@example.com" });
    await createTestUser({
      id: "test-user-1",
      name: "Test User",
      email: "test@example.com",
    });

    await app.ready();
  });

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  describe("GET /api/issues", () => {
    it("should return empty list when no issues exist", async () => {
      const response = await app.inject({
        method: "GET",
        url: "/api/issues",
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.success).toBe(true);
      expect(data.data).toEqual([]);
      expect(data.pagination.total).toBe(0);
    });

    it("should return list of issues", async () => {
      // Create test issue
      await createTestIssue({
        title: "Test Issue 1",
        created_by_user_id: "test-user-1",
      });

      const response = await app.inject({
        method: "GET",
        url: "/api/issues",
      });

      expect(response.statusCode).toBe(200);
      const data = JSON.parse(response.payload);
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].title).toBe("Test Issue 1");
    });
  });

  describe("POST /api/issues", () => {
    it("should create a new issue", async () => {
      const newIssue = {
        title: "New Issue",
        description: "Issue description",
        status: "not_started",
        priority: "medium",
      };

      const response = await app.inject({
        method: "POST",
        url: "/api/issues",
        payload: newIssue,
      });

      expect(response.statusCode).toBe(201);
      const data = JSON.parse(response.payload);
      expect(data.success).toBe(true);
      expect(data.data.title).toBe(newIssue.title);
      expect(data.data.description).toBe(newIssue.description);
    });
  });
});
