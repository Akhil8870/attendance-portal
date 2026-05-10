const router = require("express").Router();
const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

router.post("/", async (req, res) => {

  const { studentId, date, status } = req.body;

  await Attendance.findOneAndUpdate(
    { studentId, date },
    { studentId, date, status },
    { upsert: true }
  );

  res.json({
    msg: "Saved"
  });
});

router.get("/:studentId", async (req, res) => {

  const data = await Attendance.find({
    studentId: req.params.studentId
  });

  res.json(data);
});

router.get("/student/roll/:roll", async (req, res) => {

  const student = await Student.findOne({
    rollNo: req.params.roll
  });

  if (!student) {
    return res.json({
      error: true
    });
  }

  const attendance = await Attendance.find({
    studentId: student._id
  });

  res.json({
    student,
    attendance
  });
});

module.exports = router;