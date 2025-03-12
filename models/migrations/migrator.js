import { resolve } from "node:path";

import database from "infra/database";
import migrationRunner from "node-pg-migrate";

async function getPendingMigrations() {
  let client;

  try {
    client = await database.getClientConnection();

    const defaultMigrationsOptions = getDefaultMigrationOptions();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dbClient: client,
    });
    return migratedMigrations;
  } finally {
    client?.end();
  }
}

async function runMigrations() {
  let client;

  try {
    client = await database.getClientConnection();

    const defaultMigrationsOptions = getDefaultMigrationOptions();
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
      dbClient: client,
    });
    return migratedMigrations;
  } finally {
    client?.end();
  }
}

function getDefaultMigrationOptions() {
  return {
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    log: {},
    migrationsTable: "pgmigrations",
  };
}

const migrations = {
  getPendingMigrations,
  runMigrations,
};

export default migrations;
