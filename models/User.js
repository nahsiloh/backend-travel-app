const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./Trip");

const userSchema = Schema({
  // _id: Schema.Types.ObjectId,
  username: { type: String, required: true },
  email: { type: String, required: true, index: true, unique: true },
  password: { type: String, required: true, minlength: 8 }
  // trips: [{ type: Schema.Types.ObjectId, ref: "Trip" }]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
