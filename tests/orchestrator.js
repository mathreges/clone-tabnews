import retry from "async-retry";

async function waitForAllServices() {
  const statusEndpoint = "http://localhost:3000/api/v1/status";
  await waitForWebServices();

  async function waitForWebServices() {
    return retry(fetchStatusPage, {
      retries: 120,
      maxTimeout: 1000
    });

    async function fetchStatusPage() {
      const response = await fetch(statusEndpoint);
      if (!response.ok) {
        throw Error();
      }
    }
  }
}

export default {
  waitForAllServices
}