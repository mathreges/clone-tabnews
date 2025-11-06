import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.dropDatabase();
  await orchestrator.runMigrations();
});

describe("GET to /api/v1/users/[username]", () => {
  describe("Anonymous User", () => {
    const endpoint = "http://localhost:3000/api/v1/users";
    test("With exact case match", async () => {
      const userData = {
        username: "matheusReges",
        email: "testeget@gmail.com",
        password: "password123",
      };
      const postResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      expect(postResponse.status).toBe(201);

      const getResponse = await fetch(`${endpoint}/${userData.username}`);

      expect(getResponse.status).toBe(200);

      const responseBody = await getResponse.json();

      expect(responseBody).toEqual({
        ...userData,
        password: responseBody.password,
        id: responseBody.id,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With case mismatch", async () => {
      const userData = {
        username: "caseMismatch",
        email: "casemismatch@gmail.com",
        password: "password123",
      };
      const postResponse = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      expect(postResponse.status).toBe(201);

      const getResponse = await fetch(`${endpoint}/casemismatch`);

      expect(getResponse.status).toBe(200);

      const responseBody = await getResponse.json();

      expect(responseBody).toEqual({
        ...userData,
        password: responseBody.password,
        id: responseBody.id,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });
    test("With non existing user", async () => {
      const response = await fetch(`${endpoint}/nonexisting`);

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "User not found",
        action: "Check the parameters and try again",
        status_code: 404,
      });
    });
  });
});
