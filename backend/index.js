// ? Import module
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");

// ? START THE APP
const app = express();
// ? CONFIG
// ? Connecting Database
const connectDB = require("./src/utils/db");
dotenv.config({ path: "./.env" });

// ? Using Middleware
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.CLIENT_URL],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// ? Routes
const Assets = require("./src/routers/assets.router.js");

app.use("/api/v1/assets", Assets);
// ? End Routes

// ? Error handling\
// ? will be called automatically when the url doesn't exist or it's wrong
app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: true,
    message: error.message,
  });
});
// ? End error handling

// ? Server Run
const port = process.env.PORT || 5000;
connectDB(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
