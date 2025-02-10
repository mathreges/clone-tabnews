import database from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  cleanDatabase();
});

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

describe("GET to /api/v1/migrations/", () => {
  describe("Anonymous User", () => {
    test("Running pending migrations", async () => {
      const endpoint = "http://localhost:3000/api/v1/migrations";
      const response = await fetch(endpoint);
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
