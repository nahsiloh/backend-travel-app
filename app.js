const express = require("express");
const app = express();
const cors = require("cors");
require("./db");

app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));

const trips = require("./routes/trips");
app.use("/trips", trips);

module.exports = app;
