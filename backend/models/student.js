const mongoose = require("mongoose");

module.exports = mongoose.model("Student", {
  name: String,
  rollNo: String,
  dept: String,
  year: String,
  semester: String,
  section: String
});