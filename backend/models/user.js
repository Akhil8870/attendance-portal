const mongoose = require("mongoose");

module.exports = mongoose.model("User", {
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: String
});