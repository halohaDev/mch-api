const ClientError = require("./ClientError");

class UnprocessableError extends ClientError {
  constructor(message) {
    super(message, 422);
    this.message = "Unprocessable Entity";
    this.name = "UnprocessableError";
  }
}

module.exports = UnprocessableError;
