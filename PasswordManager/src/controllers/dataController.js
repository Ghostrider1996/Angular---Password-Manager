const { Router } = require("express");
const { getById, getPostCount, getAllCategory, getAllAuthenticationMethods, 
  create, createCategory, createAuthenticationMethod, update, deleteById,
} = require("../services/dataService");
const { isGuest } = require("../middleware/guardS");
const { body, validationResult } = require("express-validator");
const { userIdentity } = require("../services/jwtService");
const dataRouter = Router();
dataRouter.get("/add-account", isGuest(), async (req, res) => {
  const categories = await getAllCategory();
  const authenticationMethods = await getAllAuthenticationMethods()
  
  res.render("addAccount", { categories, authenticationMethods });
});
dataRouter.post("/add-account", isGuest(),
  body("serviceImage")
    .trim()
    .isURL({ require_tld: false })
    .withMessage("Image URL must be valid http:// or https:// URL!"),
  body("serviceName")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Service Name must be at least 1 character long!"),
  body("username")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Username must be at least 2 characters long!"),
  body("password")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Password must be at least 2 characters long!"),
  body("category").trim().notEmpty().withMessage("Category is required!"),
  body("authentication")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Authentication field cannot be empty!"),
  body("description")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Description must be at least 10 characters long!"),
  async (req, res) => {
    const userInput = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const categories = await getAllCategory();
      const authenticationMethods = await getAllAuthenticationMethods()
      return res.render("addAccount", {
        data: userInput,
        errors: errors.array(),
        categories: categories,
        authenticationMethods
      });
    }

    const userId = userIdentity(req);

    try {
      await create(userInput, userId);
      const query = `?serviceName=${userInput.serviceName}&category=`;
      res.redirect("/search/" + query);
    } catch (error) {
      console.log(error);

      const categories = await getAllCategory();
      const errors = [{ msg: error.message }];
      res.render("addAccount", {
        data: userInput,
        errors,
        categories: categories,
      });
    }
  }
);
dataRouter.get("/add-category", isGuest(), async (req, res) => {
  res.render("addCategory");
});
dataRouter.post("/add-category", isGuest(),
  body("name")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Category must be at least 5 characters long!"),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("addCategory", {
        data: req.body,
        errors: errors.array(),
      });
    }

    const data = req.body;

    try {
      await createCategory(data);

      res.redirect("/add-category");
    } catch (error) {
      console.log(error);

      const errors = [{ msg: error.message }];

      res.render("addCategory", { errors, data });
    }
  }
);
dataRouter.get("/add-authentication-method", isGuest(), async (req, res) => {
  res.render("addCategory", { authenticationMethod: true });
});
dataRouter.post("/add-authentication-method", isGuest(),
  body("method")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Authentication Method must be at least 2 characters long!"),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render("addCategory", {
        data: req.body,
        errors: errors.array(),
        authenticationMethod: true,
      });
    }

    const data = req.body;

    try {
      await createAuthenticationMethod(data);

      res.render("addCategory", { authenticationMethod: true });
    } catch (error) {
      console.log(error);
      
      const errors = [{ msg: error.message }];

      res.render("addCategory", { errors, data, authenticationMethod: true });
    }
  }
);
dataRouter.get("/record/update/:id", isGuest(), async (req, res) => {
  const id = req.params.id;
  const userId = userIdentity(req);

  try {
    const data = await getById(id, userId);
    const categories = await getAllCategory();
    const authenticationMethods = await getAllAuthenticationMethods()

    res.render("detailsUpdate", { record: data, categories, authenticationMethods });
  } catch (error) {
    const errors = [{ msg: error.message }];
    res.render("404", { errors });
  }
});
dataRouter.post("/record/update/:id", isGuest(), async (req, res) => {
  const id = req.params.id;
  const userInput = req.body;
  const userId = userIdentity(req);

  try {
    await update(id, userInput, userId);

    res.redirect("/details/" + id);
  } catch (error) {
    const errors = [{ msg: error.message }];
    res.render("404", { errors });
  }
});
dataRouter.get("/details/:id", isGuest(), async (req, res) => {
  const id = req.params.id;
  const userId = userIdentity(req);
  try {
    const data = await getById(id, userId);

    res.render("accountDetails", { record: data });
  } catch (error) {
    const errors = [{ msg: error.message }];
    res.render("404", { errors });
  }
});
dataRouter.get("/record/bin/:id", isGuest(), async (req, res) => {
  const id = req.params.id;
  const msg =
    "You're trying to delete this record. Proceed with confirm in order to finish the process or cancel to prevent removal. \
  Be ware if you proceed the record will be permanently deleted.";
  const userId = userIdentity(req);

  const record = await getById(id, userId);
  res.render("accountDetails", { record, msg, id });
});
dataRouter.get("/record/delete/cancel/:id", isGuest(), async (req, res) => {
  const id = req.params.id;
  const userId = userIdentity(req);
  const record = await getById(id, userId);
  const confirmation = "The removal has been successfully cancelled.";

  res.render("accountDetails", { record, confirmation });
});
dataRouter.get("/record/delete/:id", isGuest(), async (req, res) => {
  const id = req.params.id;
  const userId = userIdentity(req);

  try {
    await deleteById(id, userId);
    const confirmation = "Record has been successfully deleted";

    if (req.cookies.token) {
      const { userName, userId } = userIdentity(req, true);
      const count = await getPostCount(userId);

      res.render("home", { userName, count, confirmation });
    }
  } catch (error) {
    const errors = [{ msg: error.message }];
    res.render("404", { errors });
  }
});

module.exports = dataRouter;
