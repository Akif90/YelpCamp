const Campground = require("../models/campground");
const User = require("../models/user");

const isOwner = async (req, res, next) => {
  const {id} = req.params;
  const ground = await Campground.findById(id);
  if (!ground.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permissions");
    return res.redirect(`/campgrounds/${ground._id}`);
  }
  next();
};

module.exports = isOwner;
