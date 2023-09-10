if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const campgroundRoutes = require("./routes/campgroundRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");

const ExpressError = require("./helpers/ExpressError");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oidc");

const MongoStore = require("connect-mongo");

const User = require("./models/user");

const sessionConfig = {
  secret: "xyz",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60,
    maxAge: 1000 * 60 * 60,
  },
  store: MongoStore.create({mongoUrl: "mongodb://127.0.0.1:27017/campground"}),
};

const DB_URL = process.env.DB_URL;
mongoose
  .connect("mongodb://127.0.0.1:27017/campground")
  .then(() => console.log("Connected to database"))
  .catch(() => console.log("Error connecting to the database"));

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(flash());
app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));
passport.use(new LocalStrategy(User.authenticate()));
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile"],
    },
    async (issuer, profile, cb) => {
      let user = await User.findOne({googleId: profile.id});
      if (!user) {
        user = await User.create({
          username: profile.displayName,
          googleId: profile.id,
        });
        console.log(user);
      }
      cb(null, user);
    }
  )
);
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home.ejs");
  console.log(req.user);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  res.render("error", {err});
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
