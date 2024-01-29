const UnprocessableError = require("../Commons/exceptions/UnprocessableError");

class Validator {
  #key;
  #validatedOutput;
  #params;
  #errors;

  constructor(params) {
    this.#params = params;
    this.#validatedOutput = {};
    this.#errors = {};
  }

  isRequired(key, format = null) {
    // find params with key
    const value = this.#params[key];

    // if not found throw error
    if (!value) {
      const message = `${key} is required`;
      this.#pushErrors(key, { message: message });
    }

    this.#key = key;

    // if found validate
    this.#validate(value, format);
  }

  isOptional(key, format = null) {
    // if not found dont validate
    const value = this.#params[key];

    if (!value) {
      return;
    }

    this.#key = key;
    // if found validate
    this.#validate(value, format);
  }

  #validate(value, validator) {
    if (validator === null) {
      return;
    }

    // validate value with validator
    if (validator === "string") {
      this.#validateString(value);
    }

    if (validator === "number") {
      this.#validateNumber(value);
    }

    if (validator === "email") {
      this.#validateEmail(value);
    }

    if (validator === "date") {
      this.#validateDateFormat(value);
    }

    if (validator === "datetime") {
      this.#validateDateTimeFormat(value);
    }

    this.#validatedOutput[this.#key] = value;
  }

  #validateDateFormat(date) {
    // validate date format using Date.parse
    const parseDate = new Date(date);

    if (Number.isNaN(parseDate.getTime())) {
      const message = `${this.#key} is not a valid date format`;

      this.#pushErrors(this.#key, { message: message });
    }
  }

  #validateDateTimeFormat(datetime) {
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

    if (!datetimeRegex.test(datetime)) {
      const message = `${this.#key} is not a valid datetime format`;

      this.#pushErrors(this.#key, { message: message });
    }
  }

  #validateNumber(value) {
    const numberRegex = /^\d+$/;

    if (!numberRegex.test(value)) {
      const message = `${this.#key} is not a number`;

      this.#pushErrors(this.#key, { message: message });
    }
  }

  #validateString(value) {
    // validate single string value
    if (typeof value !== "string") {
      const message = `${this.#key} is not a string`;

      this.#pushErrors(this.#key, { message: message });
    }
  }

  #validateEmail(email) {
    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      const message = `${this.#key} is not a valid email`;

      this.#pushErrors(this.#key, { message: message });
    }
  }

  output() {
    if (Object.keys(this.#errors).length > 0) {
      throw new UnprocessableError(this.#errors);
    }

    return this.#validatedOutput;
  }

  #pushErrors(key, value) {
    const objectTarget = this.#errors[key];

    if (objectTarget) {
      objectTarget.push(value);
    } else {
      this.#errors[key] = [value];
    }
  }
}

module.exports = Validator;
