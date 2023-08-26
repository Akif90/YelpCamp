const express = require("express");
const router = express.Router();
const wrapError = require("../helpers/wrapAsync");
const isLoggedIn = require("../helpers/isLoggedIn");
const isOwner = require("../helpers/isOwner");
const validateCampGroundSchema = require("../helpers/validateCampGroundSchema");
const campground = require("../controllers/campground");
const multer = require("multer");
const {storage} = require("../cloudinary");
const upload = multer({storage});

router.get("/", wrapError(campground.index));

router.get("/new", isLoggedIn, campground.renderNewForm);

router.post(
  "/",
  isLoggedIn,
  upload.array("image"),
  validateCampGroundSchema,
  wrapError(campground.createNewCampground)
);

router.get("/:id", wrapError(campground.show));

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapError(campground.renderEditForm)
);

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.array("image"),
  validateCampGroundSchema,
  wrapError(campground.edit)
);

router.delete("/:id", isLoggedIn, isOwner, wrapError(campground.delete));

module.exports = router;
