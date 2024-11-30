const homeRouter = require("../controllers/homeController");
const userRouter = require("../controllers/userController");
const dataRouter = require("../controllers/dataController");
// TODO import routers

async function configRoutes(app) {
  app.use(userRouter);
  app.use(dataRouter);
  app.use(homeRouter);
}

module.exports = { configRoutes };
