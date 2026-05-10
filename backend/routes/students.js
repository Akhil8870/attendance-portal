const router = require("express").Router();
const Student = require("../models/Student");

router.post("/", async (req, res) => {

  await new Student(req.body).save();

  res.json({
    msg: "Student added"
  });
});

router.get("/", async (req, res) => {

  const data = await Student.find(req.query);

  res.json(data);
});

router.put("/:id", async (req, res) => {

  await Student.findByIdAndUpdate(
    req.params.id,
    req.body
  );

  res.json({
    msg: "Updated"
  });
});

router.delete("/:id", async (req, res) => {

  await Student.findByIdAndDelete(req.params.id);

  res.json({
    msg: "Deleted"
  });
});

module.exports = router;