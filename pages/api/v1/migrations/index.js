import migrationRunner from 'node-pg-migrate';
import { join } from "node:path";
import database from 'infra/database';

export default async function migrations(request, response) {
  const client = await database.getClientConnection();
  const defaultMigrationsOptions = {
    dbClient: client,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations"
  }

  if (request.method == 'GET') {
    const pendingMigrations = await migrationRunner(defaultMigrationsOptions);

    await client.end();

    return response.status(200).json(pendingMigrations);
  }
  if (request.method == 'POST') {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false
    });

    await client.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  }

  await client.end();
  return response.status(405);
}

