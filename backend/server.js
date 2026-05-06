const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// FRONTEND
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "select.html"));
});

// DB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✔"))
.catch(err => console.log(err));

// MODELS
const User = require("./models/user");
const Student = require("./models/student");
const Attendance = require("./models/attendance");

// ================= AUTH =================
app.post("/api/auth/register", async (req, res) => {
  const { email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.json({ msg: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  await new User({ email, password: hashed, role }).save();

  res.json({ msg: "Registered ✔" });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ msg: "User not found" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.json({ msg: "Wrong password" });

  res.json({ msg: "Login success ✔", role: user.role });
});

// ================= STUDENTS =================
app.get("/api/students", async (req, res) => {
  const { dept, year, semester, section } = req.query;

  const students = await Student.find({
    dept,
    year,
    semester,
    section
  });

  res.json(students);
});

app.post("/api/students", async (req, res) => {
  await new Student(req.body).save();
  res.json({ msg: "Student added ✔" });
});

app.put("/api/students/:id", async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, req.body);
  res.json({ msg: "Updated ✔" });
});

app.delete("/api/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted ✔" });
});

// ================= ATTENDANCE =================
app.post("/api/attendance", async (req, res) => {
  const { studentId, date, status } = req.body;

  await Attendance.findOneAndUpdate(
    { studentId, date },
    { status },
    { upsert: true }
  );

  res.json({ msg: "Saved ✔" });
});

app.get("/api/attendance/:id", async (req, res) => {
  const data = await Attendance.find({ studentId: req.params.id });
  res.json(data);
});

// ================= STUDENT ROLL =================
app.get("/api/student/roll/:rollNo", async (req, res) => {
  const student = await Student.findOne({ rollNo: req.params.rollNo });

  if (!student) {
    return res.json({ error: "Student not found" });
  }

  const attendance = await Attendance.find({ studentId: student._id });

  res.json({ student, attendance });
});

// SERVER
app.listen(5000, () => {
  console.log("Server running ✔ http://localhost:5000");
});