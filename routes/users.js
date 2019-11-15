const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const protectedRoute = require("./authentication");

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
    res.cookie("token", token);
    res.send(user);
  } catch (err) {
    if (err.message === "Login failed") {
      err.status = 400;
    }
    next(err);
  }
});

router.get("/:username", async (req, res, next) => {
  try {
    const username = req.params.username;
    const regex = new RegExp(username, "gi");
    const user = await User.find({ username: regex });
    res.send(user);
  } catch (err) {
    next(err);
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

module.exports = router;
