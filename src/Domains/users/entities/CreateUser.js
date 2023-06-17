class CreateUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { email, password, name } = payload;

    this.email = email;
    this.password = password;
    this.name = name;
  }

  _verifyPayload({ email, password, name }) {
    if (!email || !password || !name) {
      throw new Error('CREATE_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
      throw new Error('CREATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!this._verifyEmail(email)) {
      throw new Error('CREATE_USER.EMAIL_IS_NOT_VALID');
    }
  }

  _verifyEmail(email) {
    // eslint-disable-next-line no-control-regex
    const emailRegex = /(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i;
    return emailRegex.test(email);
  }
}

module.exports = CreateUser;
