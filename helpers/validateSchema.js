const Joi = require("joi");
const campGroundSchema = Joi.object({
  title: Joi.string().min(3).required(),
  price: Joi.number().min(10).required(),
  location: Joi.string().required(),
  // image: Joi.string().required(),
  description: Joi.string().required().min(10),
  deletedImages: Joi.array(),
});

const reviewSchema = Joi.object({
  body: Joi.string().min(10).required(),
  rating: Joi.number().min(1).required(),
});
module.exports = {campGroundSchema, reviewSchema};
