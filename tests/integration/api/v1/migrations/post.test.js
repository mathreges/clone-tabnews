import database from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  cleanDatabase();
});

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

describe("POST to /api/v1/migrations/", () => {
  describe("Anonymous User", () => {
    const endpoint = "http://localhost:3000/api/v1/migrations";
    test("For the first time", async () => {
      const firstResponse = await fetch(endpoint, {
        method: "POST",
      });
      expect(firstResponse.status).toBe(201);

      const firstResponseBody = await firstResponse.json();
      expect(Array.isArray(firstResponseBody)).toBe(true);
      firstResponseBody.forEach(({ path, name, timestamp }) => {
        expect(path.length).toBeGreaterThan(0);
        expect(name.length).toBeGreaterThan(0);
        expect(timestamp).toBeGreaterThan(0);
      });
    });
    test("For the second time", async () => {
      const secondResponse = await fetch(endpoint, {
        method: "POST",
      });

      expect(secondResponse.status).toBe(200);

      const secondResponseBody = await secondResponse.json();
      expect(Array.isArray(secondResponseBody)).toBe(true);
      expect(secondResponseBody.length).toBe(0);
    });
  });
});
