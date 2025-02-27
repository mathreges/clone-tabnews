import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.dropDatabase();
});

describe("PUT to /api/v1/migrations/", () => {
  describe("Anonymous User", () => {
    const endpoint = "http://localhost:3000/api/v1/migrations";
    test("Try to modify migrations", async () => {
      const response = await fetch(endpoint, {
        method: "PUT",
      });
      expect(response.status).toBe(405);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "MethodNotAllowedError",
        message: "Method not allowed for this endpoint.",
        action: "Verify if the HTTP method is valid to this endpoint.",
        status_code: 405,
      });
    });
  });
});
