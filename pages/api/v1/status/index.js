import database from "infra/database.js";

export default status;

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersion = databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections",
  );
  const databaseMaxConnections = parseInt(
    databaseMaxConnectionsResult.rows[0].max_connections,
  );

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT * FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnections = databaseOpenedConnectionsResult.rowCount;

  response.status(200).json({
    updated_at: updatedAt,
    database: {
      version: databaseVersion,
      max_connections: databaseMaxConnections,
      opened_connections: databaseOpenedConnections,
    },
  });
}
