import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("POST to /api/v1/status/", () => {
  describe("Anonymous User", () => {
    test("Retriving system status", async () => {
      const endpoint = "http://localhost:3000/api/v1/status";
      const response = await fetch(endpoint, {
        method: "POST",
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
