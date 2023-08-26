const mongoose = require("mongoose");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelper");
const Campground = require("../models/campground");

mongoose.connect("mongodb://127.0.0.1:27017/campground");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: "https://res.cloudinary.com/dtyp38cwv/image/upload/v1693076482/YelpCamp/pfu7wmaepg3ovfmzpfhk.jpg",
          filename: "YelpCamp/de7j1u4vq7kaswbi0hkr",
        },
      ],
      owner: "64e0c58248b589e676869082",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus corrupti dolorem dignissimos rem ipsum animi qui eligendi laborum laudantium sed eum vitae libero dolores, officiis minima temporibus sit fuga quasi?",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
