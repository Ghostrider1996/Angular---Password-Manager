const { Schema, model } = require("mongoose");

const authenticationMethodSchema = new Schema({
  method: {
    type: String,
    required: true,
  }
});

const authenticationMethod = model("authenticationMethod", authenticationMethodSchema);

module.exports = { authenticationMethod };