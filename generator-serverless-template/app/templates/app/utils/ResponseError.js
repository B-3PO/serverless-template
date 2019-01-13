module.exports = class ResponseError extends Error {
  constructor(message, statusCode = 500) {
    super(message, statusCode);
    Error.captureStackTrace(this, ResponseError);
    this.statusCode = statusCode;
  }
};
