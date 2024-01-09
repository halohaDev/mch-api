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

    this.#validatedOutput[this.#key] = value;
  }

  #validateDateFormat(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
      const message = `${this.#key} is not a valid date format`;

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

  #camelCaseToSnakeCase(camelCase) {
    // convert camelCase to snake_case
    return camelCase.replace(/([a-z])([A-Z])/g, "$1_$2").toUpperCase();
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
