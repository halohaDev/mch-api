const ClientError = require("./ClientError");

class UnprocessableError extends ClientError {
  constructor(detail) {
    super(null, 422);
    this.message = "Unprocessable Entity";
    this.name = "UnprocessableError";
    this.detail = detail;
  }
}

module.exports = UnprocessableError;
