const router = require("express").Router();
const Attendance = require("../models/Attendance");

router.post("/mark", async (req, res) => {
  const data = req.body;

  for (let r of data) {
    await Attendance.findOneAndUpdate(
      { studentId: r.studentId, date: r.date },
      r,
      { upsert: true }
    );
  }

  res.json({ msg: "Submitted successfully" });
});

router.get("/", async (req, res) => {
  const data = await Attendance.find(req.query);
  res.json(data);
});

module.exports = router;