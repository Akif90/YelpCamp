const {reviewSchema} = require("../helpers/validateSchema");
const ExpressError = require("../helpers/ExpressError");

const validateReviewSchema = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

module.exports = validateReviewSchema;
