import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  let client;

  try {
    client = await database.getClientConnection();
    const defaultMigrationsOptions = getDefaultMigrationOptions();
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient: client,
    });
    return response.status(200).json(pendingMigrations);
  } finally {
    await client?.end();
  }
}

async function postHandler(request, response) {
  let client;

  try {
    client = await database.getClientConnection();
    const defaultMigrationsOptions = getDefaultMigrationOptions();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
      dbClient: client,
    });
    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  } finally {
    await client?.end();
  }
}
function getDefaultMigrationOptions() {
  return {
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
}
