test("Get to  /api/v1/status/ should return 200", async () => {
  let endpoint = "http://localhost:3000/api/v1/status";
  const response = await fetch(endpoint);
  expect(response.status).toBe(200);
})