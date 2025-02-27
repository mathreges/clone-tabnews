import { Client } from "pg";
import { ServiceError } from "infra/errors";

async function query(queryObject) {
  let client;

  try {
    client = await getClientConnection();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    const publicErrorObject = new ServiceError({
      cause: error,
      message: "Error on database or query",
    });
    throw publicErrorObject;
  } finally {
    await client?.end();
  }
}

function getSslValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV == "production" ? true : false;
}

async function getClientConnection() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSslValues(),
  });
  await client.connect();

  return client;
}

const database = {
  query,
  getClientConnection,
};

export default database;
