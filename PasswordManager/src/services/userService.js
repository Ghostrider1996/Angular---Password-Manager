const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");

async function register(identity, password) {
  const existing = await User.findOne({ username: identity });

  if (existing) {
    throw new Error(`This username is already in use.`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username: identity,
    password: hashedPassword,
  });

  await user.save();

  return user;
}
async function login(username, password) {
  
  const user = await User.findOne({ username: username });

  if (!user) {
    throw new Error(`Invalid username or password`);
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error(`Invalid username or password`);
  }
  
  return user;
}

module.exports = { register, login };
