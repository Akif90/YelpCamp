const User = require("../models/user");
const passport = require("passport");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/new");
};

module.exports.register = async (req, res, next) => {
  try {
    const {email, username, password} = req.body;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Registration successful");
      res.redirect("/campgrounds");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Succefully logged out");

    res.redirect("/campgrounds");
  });
};

module.exports.login = async (req, res) => {
  req.flash("success", "Succefully logged in");
  const redirectUrl = res.locals.returnTo || "/campgrounds";

  res.redirect(redirectUrl);
};
