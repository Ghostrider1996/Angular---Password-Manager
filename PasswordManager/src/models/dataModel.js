const { Schema, model, Types } = require("mongoose");
// TODO replace with data model from the exam description

const dataSchema = new Schema({
  serviceImage: {
    type: String
  },
  serviceName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  authentication: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const Data = model("Data", dataSchema);

module.exports = { Data };
