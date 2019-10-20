const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./db");

app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.use(cors(corsOptions));

const trips = require("./routes/trips");
app.use("/trips", trips);

const users = require("./routes/users");
app.use("/users", users);

module.exports = app;
