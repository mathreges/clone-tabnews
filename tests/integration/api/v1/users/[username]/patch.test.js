import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";
import password from "models/password";
import user from "models/user";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.dropDatabase();
  await orchestrator.runMigrations();
});

describe("GET to /api/v1/users/[username]", () => {
  describe("Anonymous User", () => {
    const endpoint = "http://localhost:3000/api/v1/users";

    test("With non existing username", async () => {
      const response = await fetch(`${endpoint}/nonexisting`, {
        method: "PATCH",
      });

      expect(response.status).toBe(404);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "User not found",
        action: "Check the parameters and try again",
        status_code: 404,
      });
    });

    test("With duplicated username", async () => {
      const userData1 = {
        username: "matheusreges1",
        email: "newemail1@test.com",
        password: "password123",
      };
      const response1 = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData1),
      });

      expect(response1.status).toBe(201);

      const userData2 = {
        username: "matheusreges2",
        email: "newemail2@test.com",
        password: "password123",
      };

      const response2 = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData2),
      });

      expect(response2.status).toBe(201);

      const patchResponse = await fetch(`${endpoint}/${userData1.username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData2.username,
        }),
      });

      expect(patchResponse.status).toBe(400);

      const patchResponseBody = await patchResponse.json();

      expect(patchResponseBody).toEqual({
        name: "ValidationError",
        message: "The username is already being used.",
        action: "Use another username for this action.",
        status_code: 400,
      });
    });

    test("With duplicated email", async () => {
      const userData1 = {
        username: "mathewreges1",
        email: "samemail1@test.com",
        password: "password123",
      };

      const response1 = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData1),
      });

      expect(response1.status).toBe(201);

      const userData2 = {
        username: "mathewreges2",
        email: "samemail2@test.com",
        password: "password123",
      };

      const response2 = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData2),
      });

      expect(response2.status).toBe(201);

      const patchResponse = await fetch(`${endpoint}/${userData1.username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData2.email,
        }),
      });

      expect(patchResponse.status).toBe(400);

      const patchResponseBody = await patchResponse.json();

      expect(patchResponseBody).toEqual({
        name: "ValidationError",
        message: "The email is already being used.",
        action: "Use another email for this action.",
        status_code: 400,
      });
    });

    test("With unique username", async () => {
      const userData1 = {
        username: "testunique1",
        email: "testunique1@test.com",
        password: "password123",
      };

      const response1 = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData1),
      });

      expect(response1.status).toBe(201);

      const userData2 = {
        username: "testUnique2",
      };

      const patchResponse = await fetch(`${endpoint}/${userData1.username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData2.username,
        }),
      });

      expect(patchResponse.status).toBe(200);

      const patchResponseBody = await patchResponse.json();

      expect(patchResponseBody).toEqual({
        ...userData1,
        username: userData2.username,
        password: patchResponseBody.password,
        id: patchResponseBody.id,
        created_at: patchResponseBody.created_at,
        updated_at: patchResponseBody.updated_at,
      });

      expect(uuidVersion(patchResponseBody.id)).toBe(4);
      expect(Date.parse(patchResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(patchResponseBody.updated_at)).not.toBeNaN();

      expect(patchResponseBody.updated_at > patchResponseBody.created_at).toBe(
        true,
      );
    });

    test("With unique email", async () => {
      const userData1 = {
        username: "testunique3",
        email: "testunique3@test.com",
        password: "password123",
      };

      const response1 = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData1),
      });

      expect(response1.status).toBe(201);

      const userData2 = {
        email: "testunique4@test.com",
      };

      const patchResponse = await fetch(`${endpoint}/${userData1.username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData2),
      });

      expect(patchResponse.status).toBe(200);

      const patchResponseBody = await patchResponse.json();

      expect(patchResponseBody).toEqual({
        ...userData1,
        email: userData2.email,
        password: patchResponseBody.password,
        id: patchResponseBody.id,
        created_at: patchResponseBody.created_at,
        updated_at: patchResponseBody.updated_at,
      });

      expect(uuidVersion(patchResponseBody.id)).toBe(4);
      expect(Date.parse(patchResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(patchResponseBody.updated_at)).not.toBeNaN();

      expect(patchResponseBody.updated_at > patchResponseBody.created_at).toBe(
        true,
      );
    });

    test("With password", async () => {
      const userData1 = {
        username: "testunique10",
        email: "testunique10@test.com",
        password: "password123",
      };

      const response1 = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData1),
      });

      expect(response1.status).toBe(201);

      const userData2 = {
        password: "passwordUnique123",
      };

      const patchResponse = await fetch(`${endpoint}/${userData1.username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData2),
      });

      expect(patchResponse.status).toBe(200);

      const patchResponseBody = await patchResponse.json();

      expect(patchResponseBody).toEqual({
        ...userData1,
        password: patchResponseBody.password,
        id: patchResponseBody.id,
        created_at: patchResponseBody.created_at,
        updated_at: patchResponseBody.updated_at,
      });

      expect(uuidVersion(patchResponseBody.id)).toBe(4);
      expect(Date.parse(patchResponseBody.created_at)).not.toBeNaN();
      expect(Date.parse(patchResponseBody.updated_at)).not.toBeNaN();

      expect(patchResponseBody.updated_at > patchResponseBody.created_at).toBe(
        true,
      );

      const userInDatabase = await user.findOneByUsername(userData1.username);

      const correctPasswordMatch = await password.compare(
        userData2.password,
        userInDatabase.password,
      );

      const inCorrectPasswordMatch = await password.compare(
        userData1.password,
        userInDatabase.password,
      );

      expect(correctPasswordMatch).toBe(true);
      expect(inCorrectPasswordMatch).toBe(false);
    });
  });
});
