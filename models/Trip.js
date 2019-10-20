const mongoose = require("mongoose");
const MyObjectId = mongoose.Types.ObjectId;

const itinerarySchema = new mongoose.Schema({
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

const tripSchema = new mongoose.Schema({
  user: { type: MyObjectId, ref: "User" },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  itinerary: [itinerarySchema]
});

const Trip = mongoose.model("Trip", tripSchema);

module.exports = Trip;
