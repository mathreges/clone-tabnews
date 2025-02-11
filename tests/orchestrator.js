import retry from "async-retry";
import database from "infra/database";

async function waitForAllServices() {
  const statusEndpoint = "http://localhost:3000/api/v1/status";
  await waitForWebServices();

  async function waitForWebServices() {
    return retry(fetchStatusPage, {
      retries: 120,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch(statusEndpoint);
      if (!response.ok) {
        throw Error();
      }
    }
  }
}

async function dropDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

const orchestrator = {
  waitForAllServices,
  dropDatabase,
};

export default orchestrator;
