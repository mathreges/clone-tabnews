import database from "infra/database";
import { ValidationError, NotFoundError } from "infra/errors";

async function create(userInputValues) {
  const newUser = await runInsertQuery(userInputValues);

  return newUser;
}

async function findOneByUsername(username) {
  const user = await runSelectQuery(username);

  return user;
}

async function runSelectQuery(username) {
  const results = await database.query({
    text: `
      SELECT 
        *
      FROM 
        users 
      WHERE 
        LOWER(username) = LOWER($1)
      LIMIT
        1
    ;`,
    values: [username],
  });

  if (results.rowCount === 0) {
    throw new NotFoundError({
      message: "User not found",
      action: "Check the parameters and try again",
    });
  }

  return results.rows[0];
}

async function runInsertQuery(userInputValues) {
  const { email, username, password } = userInputValues;
  await validateUniqueEmail(email);
  await validateUniqueUsername(username);
  const results = await database.query({
    text: `
  INSERT INTO 
    users (username, email, password) 
  VALUES 
    ($1, $2, $3)
  RETURNING
    *
  ;`,
    values: [username, email, password],
  });

  return results.rows[0];
}

async function validateUniqueEmail(email) {
  const results = await database.query({
    text: `SELECT email FROM users WHERE LOWER(email) = LOWER($1);`,
    values: [email],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "The email is already being used.",
      action: "Use another email to register.",
    });
  }
}

async function validateUniqueUsername(username) {
  const results = await database.query({
    text: `SELECT username FROM users WHERE LOWER(username) = LOWER($1);`,
    values: [username],
  });

  if (results.rowCount > 0) {
    throw new ValidationError({
      message: "The username is already being used.",
      action: "Use another username to register.",
    });
  }
}

const user = {
  create,
  findOneByUsername,
};

export default user;
