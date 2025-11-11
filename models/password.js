import bcryptjs from "bcryptjs";

async function hash(password) {
  const rounds = getNumbersOfRounds();
  const passwordWithPepper = getPasswordWithPepper(password);
  return await bcryptjs.hash(passwordWithPepper, rounds);
}

function getPasswordWithPepper(password) {
  const pepper = process.env.PEPPER || "";
  return password + pepper;
}

function getNumbersOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

async function compare(rawPassword, hash) {
  const passwordWithPepper = getPasswordWithPepper(rawPassword);
  return await bcryptjs.compare(passwordWithPepper, hash);
}

const password = {
  hash,
  compare,
};

export default password;
