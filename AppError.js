class AppError {
  constructor(code, message) {
    this.code = code;
    this.message = message;
  }

  static badRequest(msg) {
    return new AppError(400, msg);
  }

  static internal(msg) {
    return new AppError(500, msg);
  }
}

module.exports = AppError;
