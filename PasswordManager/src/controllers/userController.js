const { Router } = require("express");
const userRouter = Router();
const { createToken } = require("../services/jwtService");
const { isGuest, isUser } = require("../middleware/guardS");
const { register, login } = require("../services/userService");
const { body, validationResult } = require("express-validator");

userRouter.get("/register", isUser(), (req, res) => {
  res.render("register");
});
userRouter.post("/register", isUser(),
  body("username")
    .trim()
    .isLength({ min: 10 })
    .withMessage("Username must be at least 10 characters long!"),
  body("password")
    .trim()
    .custom((value) => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;
      if (!passwordRegex.test(value)) {
        throw new Error("Password must be at least 10 characters long, with at least one uppercase letter, one digit, and one symbol.");
      }
      return true;
    }),
  body("repass")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords don't match");
      }
      return true;
    }),
  async (req, res) => {
    const { username, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("register", {
        data: { username },
        errors: errors.array(),
      });
    }
    try {
      const user = await register(username, password);
      const token = createToken(user);

      res.cookie("token", token, { httpOnly: true });
      res.redirect("/");
    } catch (err) {

      const errors = [{ msg: err.message }];

      res.render("register", {
        data: { username },
        errors,
      });
    }
  }
);
userRouter.get("/login", isUser(), (req, res) => {
  res.render("login");
});
userRouter.post("/login", isUser(),

  async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await login(username, password);

      const token = createToken(user);

      res.cookie("token", token, { httpOnly: true });

      res.redirect("/");
    } catch (error) {
      res.render("login", {
        data: {
          errors: [{ error: error.message }],
          username, // Pass back the username to pre-fill the input
        },
      });
    }
  }
);
userRouter.get("/logout", isGuest(), (req, res) => {
  if (req.cookies.token) {
    res.clearCookie("token");
  }

  res.redirect("/");
});

module.exports = userRouter;
