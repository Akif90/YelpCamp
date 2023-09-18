const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapError = require("../helpers/wrapAsync");
const passport = require("passport");
const returnTo = require("../helpers/returnTo");
const user = require("../controllers/user");

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, {_id: user.id, username: user.username});
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});
router.get("/register", user.renderRegisterForm);

router.post("/register", wrapError(user.register));

router.get("/login", user.renderLoginForm);

router.post(
  "/login",
  returnTo,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  user.login
);

router.get("/login/google", passport.authenticate("google"));

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    failureRedirect: "/login",
    failureMessage: true,
  }),
  (req, res) => {
    res.redirect("/campgrounds");
  }
);

router.get("/logout", user.logout);

module.exports = router;
