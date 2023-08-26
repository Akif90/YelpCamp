const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.addReview = async (req, res) => {
  const {id} = req.params;
  const ground = await Campground.findById(id);
  const newReview = new Review(req.body);
  newReview.owner = req.user._id;
  ground.reviews.push(newReview);
  await newReview.save();
  await ground.save();
  req.flash("success", "Successfully added a review");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const {id, reviewId} = req.params;
  Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted a review");

  res.redirect(`/campgrounds/${id}`);
};
