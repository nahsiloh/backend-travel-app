const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "secretkey";

const Trip = require("../models/Trip");

router.get("/", async (req, res, next) => {
  try {
    const trips = await Trip.find();
    res.send(trips);
  } catch (err) {
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

router.get("/:id", protectedRoute, async (req, res, next) => {
  try {
    const id = req.params.id;
    const trip = await Trip.findById(id);
    res.send(trip);
  } catch (err) {
    next(err);
  }
});

router.post("/new", protectedRoute, async (req, res, next) => {
  try {
    const addTrip = new Trip(req.body);
    await Trip.init();
    const newTrip = await addTrip.save();
    res.send(newTrip);
  } catch (err) {
    next(err);
  }
});

router.patch("/:id", protectedRoute, async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateTrip = req.body;
    await Trip.findByIdAndUpdate(id, updateTrip, { new: true });
    const trips = await Trip.find();
    res.send(trips);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", protectedRoute, async (req, res, next) => {
  try {
    const id = req.params.id;
    await Trip.findByIdAndDelete(id);
    const trips = await Trip.find();
    res.send(trips);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
