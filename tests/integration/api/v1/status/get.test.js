import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("Get to  /api/v1/status/ should return 200", async () => {
  let endpoint = "http://localhost:3000/api/v1/status";
  const response = await fetch(endpoint);

  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedStatusDate = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedStatusDate);

  expect(responseBody.database.version).toBeDefined()
  expect(responseBody.database.max_connections).toBeDefined();
  expect(responseBody.database.opened_connections).toBe(1)
});