const { Router } = require("express");
const homeRouter = Router();
const { isGuest } = require("../middleware/guardS");
const {
  getAll,
  getPostCount,
  getRecent,
  getAllCategory,
} = require("../services/dataService");
const { userIdentity } = require("../services/jwtService");
homeRouter.get("/", async (req, res) => {
  if (req.cookies.token) {
    const { userName, userId } = userIdentity(req, true);
    const count = await getPostCount(userId);

    res.render("home", { userName, count });
  } else {
    res.render("home");
  }
});
homeRouter.get("/about", (req, res) => {
  res.render("about")
})
homeRouter.get("/search", isGuest(), async (req, res) => {
  const userId = userIdentity(req);
  const { serviceName, category } = req.query;

  let results;

  try {
    const categories = await getAllCategory();
    if (serviceName || category) {
      results = await getAll(serviceName, category, userId);
    } else {
      const limit = 8;
      results = await getRecent(limit, userId);
    }

    res.render("search", {
      inputs: { serviceName, category },
      results,
      categories,
    });
  } catch (error) {
    const errors = [{ msg: error.message }];
    res.render("404", { errors });
  }
});
homeRouter.get("/404", async (req, res) => {
  res.render("404");
});
homeRouter.get("*", async (req, res) => {
  res.render("404");
});

module.exports = homeRouter;
