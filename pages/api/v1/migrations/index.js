import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

export default async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (!allowedMethods.includes(request.method)) {
    return response.status(405).json({
      error: `Request method "${request.method}" not allowed.`,
    });
  }

  let client;

  try {
    client = await database.getClientConnection();
    const defaultMigrationsOptions = {
      dbClient: client,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    if (request.method == "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationsOptions);
      return response.status(200).json(pendingMigrations);
    }
    if (request.method == "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationsOptions,
        dryRun: false,
      });
      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    return response.status(405);
  } finally {
    await client.end();
  }
}
