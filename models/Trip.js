const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema({
  program: {
    type: String,
    enum: ["Accommodation", "Attraction", "Transportation", "Others"],
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  cost: { type: Number, min: 0 },
  date: { type: Date }
});

const tripSchema = new mongoose.Schema({
  itineraries: [itinerarySchema]
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
