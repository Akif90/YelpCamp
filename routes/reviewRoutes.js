const express = require("express");
const router = express.Router({mergeParams: true});
const wrapError = require("../helpers/wrapAsync");
const isLoggedIn = require("../helpers/isLoggedIn");
const validateReviewSchema = require("../helpers/validateReviewSchema");
const review = require("../controllers/review");

router.post("/", isLoggedIn, validateReviewSchema, wrapError(review.addReview));

router.delete("/:reviewId", isLoggedIn, wrapError(review.deleteReview));

module.exports = router;
