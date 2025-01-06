const { exec } = require("node:child_process")

function checkPostgres() {
  exec('docker exec postgres-dev pg_isready --host localhost', handleDockerExec);

  function handleDockerExec(error, stdout) {
    if (stdout.search('accepting connections') == -1) {
      process.stdout.write('.');
      checkPostgres();
      return;
    }
    process.stdout.write('\n 🟢 Postgres is ready and accepting connections. \n');
  }
}
process.stdout.write('\n 🔴 Postgres is not ready.\n');

checkPostgres();