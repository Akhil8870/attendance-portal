const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ================= FRONTEND =================
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ================= DB =================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected ✔"))
.catch(err => console.log("DB Error:", err));

// ================= MODELS (SAFE IMPORT) =================
const User = require("./models/user");
const Student = require("./models/student");
const Attendance = require("./models/attendance");

// ================= AUTH REGISTER =================
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.json({ msg: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    await new User({ email, password: hashed, role }).save();

    res.json({ msg: "Registered ✔" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// ================= AUTH LOGIN (FIXED - NO CRASH) =================
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.status(400).json({ msg: "Wrong password" });
    }

    return res.json({
      msg: "Login success ✔",
      role: user.role
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
});

// ================= STUDENTS =================
app.get("/api/students", async (req, res) => {
  try {
    const { dept, year, semester, section } = req.query;

    const students = await Student.find({
      dept,
      year,
      semester,
      section
    });

    res.json(students);

  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});

app.post("/api/students", async (req, res) => {
  try {
    await new Student(req.body).save();
    res.json({ msg: "Student added ✔" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error adding student" });
  }
});

app.put("/api/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.json({ msg: "Updated ✔" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Update error" });
  }
});

app.delete("/api/students/:id", async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ msg: "Deleted ✔" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Delete error" });
  }
});

// ================= ATTENDANCE =================
app.post("/api/attendance", async (req, res) => {
  try {
    const { studentId, date, status } = req.body;

    await Attendance.findOneAndUpdate(
      { studentId, date },
      { status },
      { upsert: true }
    );

    res.json({ msg: "Saved ✔" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Attendance error" });
  }
});

app.get("/api/attendance/:id", async (req, res) => {
  try {
    const data = await Attendance.find({ studentId: req.params.id });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
});

// ================= STUDENT ROLL =================
app.get("/api/student/roll/:rollNo", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNo: req.params.rollNo });

    if (!student) {
      return res.json({ error: "Student not found" });
    }

    const attendance = await Attendance.find({ studentId: student._id });

    res.json({ student, attendance });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running ✔ http://localhost:${PORT}`);
});