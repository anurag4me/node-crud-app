const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");
const fs = require("fs");
const { type } = require("os");

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

// Edit an user route
router.get("/edit/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  if (!user) return res.json({ message: "User not found!" });
  res.render("edit", { title: "Edit User", user: user });
});

// Update user route
router.post("/update/:userId", upload, async (req, res) => {
  let new_image = "";
  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./uploads/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  const user = await User.findByIdAndUpdate(req.params.userId, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    image: new_image,
  });
  if (!user) return res.json({ message: "User not found!" });
  req.session.message = {
    type: "success",
    message: "User updated successfully!",
  };
  res.redirect("/");
});

module.exports = router;
