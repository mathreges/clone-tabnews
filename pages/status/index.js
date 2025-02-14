import useSWR from "swr";
import Link from "next/link";

async function fetchApi(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <section className="status">
      <StatusUpdate />
      <Database />
      <Link className="home-link" href="/">
        Home
      </Link>
    </section>
  );
}

function StatusUpdate() {
  const { isLoading } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  let status = isLoading ? "Loading..." : "Active 🟢";

  return (
    <div className="status__update">
      <h1>Project Status</h1>
      <span className="">{status}</span>
      <UpdatedAt />
    </div>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  let updatedAt = "Loading...";

  if (!isLoading && data) {
    updatedAt = new Date(data.updated_at).toLocaleString("en");
  }

  return (
    <>
      <p>Last update: {updatedAt}</p>
    </>
  );
}

function Database() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchApi, {
    refreshInterval: 2000,
  });

  const maxConnections = isLoading
    ? "Loading..."
    : data.database.max_connections;
  const openedConnections = isLoading
    ? "Loading..."
    : data.database.opened_connections;
  const databaseVersion = isLoading ? "Loading..." : data.database.version;

  return (
    <div className="status__database">
      <h2>Database information</h2>
      <p>Maximum connections: {maxConnections}</p>
      <p>Current opened connections: {openedConnections}</p>
      <p>Database version: {databaseVersion}</p>
    </div>
  );
}
