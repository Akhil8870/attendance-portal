const mongoose = require("mongoose");

module.exports = mongoose.model("Attendance", {
  studentId: String,
  date: String,
  status: String
});