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
      this.#errors[key].push({
        message: `${this.#camelCaseToSnakeCase(key)} is required`,
      });
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
      this.#errors[this.#key].push({
        message: `${this.#camelCaseToSnakeCase(
          this.#key
        )} is not in date format`,
      });
    }
  }

  #validateNumber(value) {
    const numberRegex = /^\d+$/;

    if (!numberRegex.test(value)) {
      this.#errors[this.#key].push({
        message: `${this.#camelCaseToSnakeCase(this.#key)} is not a number`,
      });
    }
  }

  #validateString(value) {
    // validate single string value
    if (typeof value !== "string") {
      this.#errors[this.#key].push({
        message: `${this.#camelCaseToSnakeCase(this.#key)} is not a string`,
      });
    }
  }

  #validateEmail(email) {
    const emailRegex = /\S+@\S+\.\S+/;

    if (!emailRegex.test(email)) {
      this.#errors[this.#key].push({
        message: `${this.#camelCaseToSnakeCase(
          this.#key
        )} is not a valid email`,
      });
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
}

module.exports = Validator;
