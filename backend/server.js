const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

/* MIDDLEWARE */

app.use(cors());

app.use(express.json());

/* MONGODB */

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB Connected ✅");
})
.catch(err => {
  console.log(err);
});

/* ROUTES */

app.use("/api/auth", require("./routes/auth"));

app.use("/api/students", require("./routes/students"));

app.use("/api/attendance", require("./routes/attendance"));

/* FRONTEND */

const frontendPath =
path.join(__dirname, "../frontend");

app.use(express.static(frontendPath));

/* HOME PAGE */

app.get("/", (req, res) => {

  res.sendFile(
    path.join(frontendPath, "index.html")
  );

});

/* START SERVER */

const PORT =
process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT} 🚀`
  );

});