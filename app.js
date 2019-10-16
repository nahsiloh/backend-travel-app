const express = require("express");
const app = express();
require("./db");

app.use(express.json());

const trips = require("./routes/trips");
app.use("/trips", trips);

module.exports = app;
