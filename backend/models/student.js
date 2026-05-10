const mongoose = require("mongoose");

module.exports = mongoose.model("Student", {
  name: String,
  rollNo: {
    type: String,
    unique: true
  },
  dept: String,
  year: String,
  semester: String,
  section: String
});