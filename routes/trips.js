const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const protectedRoute = require("./authentication");

const Trip = require("../models/Trip");

router.get("/", async (req, res, next) => {
  try {
    const trips = await Trip.find();
    res.send(trips);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const trip = await Trip.findById(id);
    res.send(trip);
  } catch (err) {
    next(err);
  }
});

router.post("/new", async (req, res, next) => {
  try {
    const addTrip = new Trip(req.body);
    await Trip.init();
    const newTrip = await addTrip.save();
    res.send(newTrip);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const updateTrip = req.body;
    await Trip.findByIdAndUpdate(id, updateTrip, { omitUndefined: false });
    const trips = await Trip.findById(id);
    res.send(trips);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
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
