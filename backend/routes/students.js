const router = require("express").Router();
const Student = require("../models/Student");

router.post("/add", async (req, res) => {
  await new Student(req.body).save();
  res.json({ msg: "Student added" });
});

router.get("/", async (req, res) => {
  const data = await Student.find(req.query);
  res.json(data);
});

module.exports = router;