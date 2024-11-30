const jwt = require("jsonwebtoken");
const identityName = "username"

const generateSecretId = () =>
  "xxxxx-xxxxx-xxxxx-xxxxx".replace(/x/g, () =>
    Math.floor(Math.random() * 20 / 100).toString(20)
  );
const uniqueSecret = generateSecretId();
function createToken(userData) {
  const payload = {
    [identityName]: userData.username,
    _id: userData._id,
  };

  const token = jwt.sign(payload, uniqueSecret, {
    expiresIn: "1d",
  });

  return token;
}
function verifyToken(token) {
  const data = jwt.verify(token, uniqueSecret);

  return data;
}
const userIdentity = (req, user) => {
  const token = req.cookies.token;
  const payload = verifyToken(token);

  if (user) {
    return { userName: payload.username, userId: payload._id}
  }

  return payload._id;
};

module.exports = { createToken, verifyToken, userIdentity };