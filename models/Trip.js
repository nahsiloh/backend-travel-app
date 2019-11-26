const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./User");

const itinerarySchema = Schema({
  program: {
    type: String,
    enum: ["accommodation", "attraction", "transportation", "others"],
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  cost: { type: Number, default: 0 },
  date: { type: Date, required: true }
});

const tripSchema = Schema({
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  itinerary: [itinerarySchema]
  // users: [{ type: Schema.Types.ObjectId, ref: "User", required: true }]
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
