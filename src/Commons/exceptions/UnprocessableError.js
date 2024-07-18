const ClientError = require("./ClientError");

class UnprocessableError extends ClientError {
  constructor(detail) {
    super(null, 422);
    this.message = "Unprocessable Entity";
    this.name = "UnprocessableError";
    this.detail = detail;

    if (typeof detail === "string") {
      this.message = detail;
    } else {
      this.message = "Something wrong with your request";
      Object.values(detail).forEach((detailItem) => {
        detailItem?.forEach((item) => {
          this.message = `${this.message}, ${item.message}`;
        });
      });
    }
  }
}

module.exports = UnprocessableError;
