const { Data } = require("../models/dataModel");
const { Category } = require("../models/categoryModel");
const { authenticationMethod } = require("../models/authenticationModel")
async function getAll(serviceName, category, userId) {
  let query = {};

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (serviceName) {
    query.serviceName = new RegExp(serviceName, "i");
  }

  if (category) {
    query.category = category;
  }

  query.author = userId;

  const results = await Data.find(query).lean();

  return results;
}
async function getById(id, userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const record = await Data.findById(id).lean();

  if (record.author.toString() !== userId.toString()) {
    throw new Error("Access Denied!");
  }

  if (!record) {
    throw new ReferenceError("No record with ID - " + id);
  }

  return record;
}
const getPostCount = async (userId) => {
  const count = await Data.countDocuments({ author: userId });

  return count;
};
async function getRecent(limit, userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    const data = await Data.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return data;
  } catch (error) {
    throw new Error("Could not fetch recent records");
  }
}
async function create(userInput, userId) {
  const isExisting = await Data.find({
    serviceName: userInput.serviceName.trim(),
    author: userId,
  });
  console.log(isExisting);

  if (isExisting.length) {
    throw new Error("Account with that service already exist");
  }

  const record = new Data({
    serviceImage: userInput.serviceImage,
    serviceName: userInput.serviceName,
    username: userInput.username,
    password: userInput.password,
    category: userInput.category,
    authentication: userInput.authentication,
    description: userInput.description,
    author: userId,
  });

  await record.save();

  return record;
}
const createAuthenticationMethod = async (data) => {
  const isExisting = await authenticationMethod.find({ authentication: data.method });

  if (isExisting.length) {
    throw new Error("The Authentication Method already exist");
  }

  const record = new authenticationMethod({
    method: data.method,
  });

  await record.save();

  return record;
};
const createCategory = async (data) => {
  const isExisting = await Category.find({ category: data.name });

  if (isExisting.length) {
    throw new Error("The category already exist");
  }

  const record = new Category({
    category: data,
  });

  await record.save();

  return record;
};
const getAllCategory = async () => {
  return Category.find().lean();
};
const getAllAuthenticationMethods = async () => {
  const data = await authenticationMethod.find().lean()

  return data
}
async function update(id, data, userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const record = await Data.findById(id);

  if (!record) {
    throw new ReferenceError("No record with ID - " + id);
  }

  if (record.author.toString() != userId.toString()) {
    throw new Error("Access Denied!");
  }
  record.serviceImage = data.serviceImage;
  record.serviceName = data.serviceName;
  record.category = data.category;
  record.username = data.username;
  record.password = data.password;
  record.authentication = data.authentication;
  record.description = data.description;

  await record.save();

  return record;
}
async function deleteById(id, userId) {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const record = await Data.findById(id);

  if (!record) {
    throw new ReferenceError("No record with ID - " + id);
  }

  if (record.author.toString() !== userId.toString()) {
    throw new Error("Access Denied!");
  }

  await Data.findByIdAndDelete(id);

  return true;
}

module.exports = {
  getAll,
  getPostCount,
  getAllCategory,
  getAllAuthenticationMethods,
  getById,
  getRecent,
  create,
  createCategory,
  createAuthenticationMethod,
  update,
  deleteById,
};
