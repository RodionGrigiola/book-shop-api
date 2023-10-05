class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith(4) ? "fail" : "error";
    this.isOperational = true;
  }
}

module.exports = AppError;
