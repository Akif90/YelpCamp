const Campground = require("../models/campground");
const {cloudinary} = require("../cloudinary");
const mbxStyles = require("@mapbox/mapbox-sdk/services/geocoding");
const geoCodingClient = mbxStyles({accessToken: process.env.MAP_BOX_TOKEN});

module.exports.index = async (req, res) => {
  const allGrounds = await Campground.find({});
  res.render("campgrounds/index", {allGrounds});
};

module.exports.renderNewForm = (req, res, next) => {
  res.render("campgrounds/new");
};

module.exports.createNewCampground = async (req, res, next) => {
  const arrayImages = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  const geoData = await geoCodingClient
    .forwardGeocode({query: req.body.location, limit: 1})
    .send();
  const ground = new Campground(req.body);
  ground.owner = req.user.id;
  ground.images = arrayImages;
  ground.geometry = geoData.body.features[0].geometry;
  await ground.save();
  console.log(ground);
  req.flash("success", "Successfully created a campground");
  res.redirect("/campgrounds");
};

module.exports.show = async (req, res) => {
  const {id} = req.params;
  const ground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
      },
    })
    .populate("owner");
  res.render("campgrounds/show", {ground});
};

module.exports.renderEditForm = async (req, res) => {
  const {id} = req.params;
  const grounds = await Campground.findById(id);
  console.log(grounds);
  res.render("campgrounds/edit", {grounds});
};

module.exports.edit = async (req, res) => {
  const {id} = req.params;
  const ground = await Campground.findByIdAndUpdate(id, req.body);

  const arrayImages = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  const geoData = await geoCodingClient
    .forwardGeocode({query: req.body.location, limit: 1})
    .send();
  ground.geometry = geoData.body.features[0].geometry;
  ground.images.push(...arrayImages);

  await ground.save();

  if (req.body.deletedImages) {
    for (path of req.body.deletedImages) {
      await cloudinary.uploader.destroy(path);
    }
    await ground.updateOne({
      $pull: {images: {filename: {$in: req.body.deletedImages}}},
    });
  }
  req.flash("success", "Successfully updated");
  res.redirect("/campgrounds");
};

module.exports.delete = async (req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted");

  res.redirect("/campgrounds");
};
