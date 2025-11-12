import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";
import password from "models/password";
import user from "models/user";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.dropDatabase();
  await orchestrator.runMigrations();
});

describe("POST to /api/v1/users/", () => {
  describe("Anonymous User", () => {
    const endpoint = "http://localhost:3000/api/v1/users";
    test("With unique and valid data", async () => {
      const userData = {
        username: "maatheusreges2",
        email: "duplicado@gmail.com",
        password: "password123",
      };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

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

      const userInDatabase = await user.findOneByUsername(userData.username);

      const correctPasswordMatch = await password.compare(
        userData.password,
        userInDatabase.password,
      );

      const inCorrectPasswordMatch = await password.compare(
        userData.password + "foo",
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(inCorrectPasswordMatch).toBe(false);
    });

    test("With duplicated email", async () => {
      const userData = {
        username: "maatheusreges3",
        email: "dUpLICAdo@gmail.com",
        password: "password123",
      };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "The email is already being used.",
        action: "Use another email for this action.",
        status_code: 400,
      });
    });

    test("With duplicated username", async () => {
      const userData = {
        username: "maAtheusrEges2",
        email: "newemai@test.com",
        password: "password123",
      };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "The username is already being used.",
        action: "Use another username for this action.",
        status_code: 400,
      });
    });
  });
});
