class CreatedUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { email, name } = payload;

    this.email = email;
    this.name = name;
  }

  _verifyPayload({ email, name }) {
    if (!email || !name) {
      throw new Error('CREATED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof email !== 'string' || typeof name !== 'string') {
      throw new Error('CREATED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreatedUser;
