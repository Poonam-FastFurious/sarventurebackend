class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static handleError(err, res) {
    const { statusCode, message, errors } = err;
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
      errors,
    });
  }
}

export { ApiError };
