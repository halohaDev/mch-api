class DomainBase {
  #key;

  #params;

  constructor(params) {
    this.#params = params;
  }

  isRequired(key, format = null) {
    // find params with key
    const value = this.#params[key];

    // if not found throw error
    if (!value) {
      throw new Error(`${this.#camelCaseToSnakeCase(key)}.INPUT_VALIDATION.IS_REQUIRED`);
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
    if (validator === 'string') {
      this.#validateString(value);
    }

    if (validator === 'number') {
      this.#validateNumber(value);
    }

    if (validator === 'email') {
      this.#validateEmail(value);
    }

    if (validator === 'date') {
      this.#validateDateFormat(value);
    }
  }

  #validateDateFormat(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(date)) {
      throw new Error(`${this.#camelCaseToSnakeCase(this.#key)}.INPUT_VALIDATION.DATE_FORMAT_NOT_VALID`);
    }
  }

  #validateNumber(value) {
    const numberRegex = /^\d+$/;

    if (!numberRegex.test(value)) {
      throw new Error(`${this.#camelCaseToSnakeCase(this.#key)}.INPUT_VALIDATION.IS_NOT_NUMBER`);
    }
  }

  #validateString(value) {
    // validate single string value
    if (typeof value !== 'string') {
      throw new Error(`${this.#camelCaseToSnakeCase(this.#key)}.INPUT_VALIDATION.IS_NOT_STRING`);
    }
  }

  #validateEmail(email) {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      throw new Error(`${email}.INPUT_VALIDATION.IS_NOT_EMAIL`);
    }
  }

  #camelCaseToSnakeCase(camelCase) {
    // convert camelCase to snake_case
    return camelCase.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
  }
}

module.exports = DomainBase;
