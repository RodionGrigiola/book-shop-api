const mongoose = require("mongoose");
const dotenv = require("dotenv");

/*
  1) Catch uncaughtException
  2) Catch unhandledRejection
  3) Import config file
  4) Import mongoose and connect to the database
  5) Create server using express app
*/

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught Exception 💥 Shutting down...");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((connection) => {
    console.log("success");
  });

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log("listening");
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Promise Rejection 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
