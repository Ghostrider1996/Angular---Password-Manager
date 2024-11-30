const express = require("express");
const { configHbs } = require("./config/configHbs");
const { configRoutes } = require("./config/configRouter");
const { configExpress } = require("./config/configExpress");
const { configDatabase } = require("./config/configDatabase");

const PORT = process.env.PORT || 3050;
const app = express();

start();

async function start() {
  await configDatabase();
  configExpress(app);
  configRoutes(app);
  configHbs(app);

  app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
  });
}

