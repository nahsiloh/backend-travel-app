const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

app.use(cookieParser());
app.use(express.json());

const corsOptions = {
  origin: ["http://localhost:3000", "https://letsfly.netlify.com"],
  preflightContinue: false,
  credentials: true,
  allowedHeaders: "content-type"
};

app.use(cors(corsOptions));

if (app.get("env") !== "trip-db") {
  require("./db");
}

const trips = require("./routes/trips");
app.use("/trips", trips);

const users = require("./routes/users");
app.use("/users", users);

module.exports = app;
