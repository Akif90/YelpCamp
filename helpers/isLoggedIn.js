const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must sign in first");
    req.session.returnTo = req.originalUrl;
    return res.redirect("/login");
  } else return next();
};

module.exports = isLoggedIn;
