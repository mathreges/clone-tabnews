import database from "infra/database";
import password from "models/password";
import { ValidationError, NotFoundError } from "infra/errors";

async function create(userInputValues) {
  const newUser = await runInsertQuery(userInputValues);

  return newUser;
}

async function findOneByUsername(username) {
  const user = await runSelectQuery(username);

  return user;
}

async function update(username, userInputValues) {
  const user = await runSelectQuery(username);

  if (
    userInputValues.username &&
    userInputValues.username?.toLowerCase() !== username.toLowerCase()
  ) {
    await validateUniqueUsername(userInputValues.username);
  }

  if (userInputValues.email) {
    await validateUniqueEmail(userInputValues.email);
  }

  if (userInputValues.password) {
    userInputValues = await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...user, ...userInputValues };
  const updatedUser = await runUpdateQuery(userWithNewValues);

  return updatedUser;
}

async function runUpdateQuery(userWithNewValues) {
  const { id, username, email, password } = userWithNewValues;
  const results = await database.query({
    text: `
      UPDATE
        users
      SET 
        username = $2,
        email = $3,
        password = $4,
        updated_at = timezone('utc', now()) 
      WHERE 
        id = $1
      RETURNING
        *
    ;`,
    values: [id, username, email, password],
  });

  return results.rows[0];
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
  let { email, username } = userInputValues;

  await validateUniqueUsername(username);
  await validateUniqueEmail(email);

  userInputValues = await hashPasswordInObject(userInputValues);

  const { password } = userInputValues;

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
      action: "Use another email for this action.",
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
      action: "Use another username for this action.",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const passwordHash = await password.hash(userInputValues.password);
  userInputValues.password = passwordHash;
  return userInputValues;
}

const user = {
  create,
  findOneByUsername,
  update,
};

export default user;
