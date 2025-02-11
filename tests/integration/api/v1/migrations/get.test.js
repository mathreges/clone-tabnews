import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.dropDatabase();
});

describe("GET to /api/v1/migrations/", () => {
  describe("Anonymous User", () => {
    test("Retrieving pending migrations", async () => {
      const endpoint = "http://localhost:3000/api/v1/migrations";
      const response = await fetch(endpoint);
      expect(response.status).toBe(200);

      const responseBody = await response.json();

      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});
