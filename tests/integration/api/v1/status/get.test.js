import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("GET to /api/v1/status/", () => {
  describe("Anonymous User", () => {
    test("Retriving system status", async () => {
      const endpoint = "http://localhost:3000/api/v1/status";
      const response = await fetch(endpoint);

      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(responseBody.updated_at).toBeDefined();

      const parsedStatusDate = new Date(responseBody.updated_at).toISOString();
      expect(responseBody.updated_at).toEqual(parsedStatusDate);

      expect(responseBody.database.version).toBeDefined();
      expect(responseBody.database.max_connections).toBeDefined();
      expect(responseBody.database.opened_connections).toBe(1);
    });
  });
});
