const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  const { email, password, role } = req.body;

  const hash = await bcrypt.hash(password, 10);
  await new User({ email, password: hash, role }).save();

  res.json({ msg: "Registered Successfully" });
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.json({ msg: "Please register" });

  const ok = await bcrypt.compare(req.body.password, user.password);

  if (!ok) return res.json({ msg: "Wrong password" });

  res.json({ msg: "Login success", role: user.role });
});

module.exports = router;