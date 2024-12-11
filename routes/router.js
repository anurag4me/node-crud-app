const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");

// image upload
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

// Insert an user into database route
router.post("/add", upload, async (req, res) => {
  console.log(req.body);
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: req.file.filename,
  });
  if (!user)
    return res.json({ message: "Error occurred in creating new user" });
  req.session.message = {
    type: "success",
    message: "User added successfully!",
  };
  res.redirect("/");
});

// Get all users route
router.get("/", async (req, res) => {
  const allUsers = await User.find({});
  if (!allUsers) return res.json({ message: "Error" });
  req.session.message = {
    type: "success",
    message: "User added successfully!",
  };
  res.render("index", { title: "Home Page", users: allUsers });
});

router.get("/add", (req, res) => {
  res.render("add", { title: "Add User" });
});

module.exports = router;
