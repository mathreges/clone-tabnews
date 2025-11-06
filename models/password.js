import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumbersOfRounds();
  return await bcryptjs.hash(password, rounds);
}

function getNumbersOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(rawPassword, hash) {
  return await bcryptjs.compare(rawPassword, hash);
}

const password = {
  hash,
  compare,
};

export default password;
