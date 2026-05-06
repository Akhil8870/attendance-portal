const mongoose = require("mongoose");

module.exports = mongoose.model("Attendance", {
  studentId: String,
  date: String,
  status: String // "Present" or "Absent"
});