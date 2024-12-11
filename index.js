// imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 4000;

// database connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("MongoDb connected!"))
  .catch((err) => console.log("Mongo Error", err));

app.get("/", (req, res) => {
  res.send("Welcome to NodeJs CRUD application");
});

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
