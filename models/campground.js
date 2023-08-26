const mongoose = require("mongoose");
const {campGroundSchema} = require("../helpers/validateSchema");
const Review = require("./review");
const {Schema} = mongoose;
const opts = {toJSON: {virtuals: true}};
const imageSchema = new Schema({
  url: String,
  filename: String,
});
imageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
const campgroundSchema = new Schema(
  {
    title: String,
    price: Number,
    images: [imageSchema],
    description: String,
    location: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
  return `<a href ="/campgrounds/${this._id}">${this.title}</a>`;
});
campgroundSchema.post("findOneAndDelete", async (doc) => {
  console.log("Deleting");
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});
module.exports = new mongoose.model("Campground", campgroundSchema);
