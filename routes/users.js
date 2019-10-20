const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const SECRET_KEY = "secretkey";

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const user = new User(req.body);

    const rounds = 10;
    const hash = await bcrypt.hash(user.password, rounds);
    user.password = hash;

    await User.init();
    const newUser = await user.save();
    res.send(newUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      throw new Error("Login failed");
    }

    const token = jwt.sign({ name: user.username }, SECRET_KEY);
    console.log(token);
    res.cookie("token", token);

    res.send(user);
  } catch (err) {
    if (err.message === "Login failed") {
      err.status = 400;
    }
    next(err);
  }
});

const protectedRoute = (req, res, next) => {
  try {
    if (!req.cookies.token) {
      throw new Error("You need a travel ticket!");
    }
    req.user = jwt.verify(req.cookies.token, SECRET_KEY);
    next();
  } catch (err) {
    res.status(401).end("You are not authorised");
  }
};

//protected route
router.get("/:username", protectedRoute, async (req, res, next) => {
  try {
    const username = req.params.username;
    const regex = new RegExp(username, "gi");
    const user = await User.find({ username: regex });
    res.send(user);
  } catch (err) {
    next(err);
  }
});

// router.get("/:username/trips", (req, res) => {
//   const username = req.params.username;
// });

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

module.exports = router;
