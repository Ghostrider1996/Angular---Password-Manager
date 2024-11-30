const mongoose = require("mongoose");
require("../models/userModel");
require("../models/dataModel");  
require("../models/categoryModel")
require("../models/authenticationModel")

async function configDatabase() {
  const connectionString = "mongodb://localhost:27017/PasswordManager";

  await mongoose.connect(connectionString);
}

console.log("Database connected");

module.exports = { configDatabase };
