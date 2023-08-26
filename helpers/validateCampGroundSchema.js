const {campGroundSchema} = require("../helpers/validateSchema");
const ExpressError = require("../helpers/ExpressError");

const validateCampGroundSchema = (req, res, next) => {
  const {error} = campGroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ExpressError(msg, 400);
  } else next();
};

module.exports = validateCampGroundSchema;
