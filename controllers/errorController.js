const chalk = require("chalk");
const AppError = require("../utils/AppError");

exports.globalErrorHandler = (err, req, res, next) => {
  console.log(chalk.red(err.message));

  let error = err;
  if (err.name === "CastError") error = new AppError(400, "Invalid ID");

  res.status(400).send(`
    <h1>Huston we're in trouble!</h1>
    <p>${error.message} : code ${error.statusCode}</p>
    `);
};
