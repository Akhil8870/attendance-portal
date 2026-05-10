const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
      return res.json({ msg: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    await new User({
      email,
      password: hash,
      role
    }).save();

    res.json({ msg: "Registered Successfully" });

  } catch (err) {
    res.json({ msg: "Error" });
  }
});

router.post("/login", async (req, res) => {
  try {

    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ msg: "Please register" });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
      return res.json({ msg: "Wrong password" });
    }

    // staff can enter student/staff
    if (user.role === "student" && role === "staff") {
      return res.json({
        msg: "Access denied"
      });
    }

    res.json({
      msg: "Login success",
      role: user.role
    });

  } catch (err) {
    res.json({ msg: "Error" });
  }
});

router.post("/forgot", async (req, res) => {

  const { email, password } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await User.updateOne(
    { email },
    { password: hash }
  );

  res.json({
    msg: "Password updated"
  });
});

module.exports = router;