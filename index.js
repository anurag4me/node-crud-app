// imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const getRoute = require("./routes/router");

const app = express();
const PORT = process.env.PORT || 4000;

// database connection
mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("MongoDb connected!"))
  .catch((err) => console.log("Mongo Error", err));

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(express.static("uploads"));

// set template engine
app.set("view engine", "ejs");

// route prefix
app.use("", getRoute);

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
