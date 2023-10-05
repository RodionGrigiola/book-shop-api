const express = require("express");
const booksRouter = require("./routes/booksRoute");
const userRouter = require("./routes/userRoutes");
const errorController = require("./controllers/errorController");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/books", booksRouter);
app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  res.status(404).send(`<h1>Page not found! Code 404</h1>`);
});

app.use(errorController.globalErrorHandler);

module.exports = app;
