class CreatedUser {
  constructor(payload) {
    this._verifyPayload(payload);

    const { email, name, id } = payload;

    this.id = id;
    this.email = email;
    this.name = name;
  }

  _verifyPayload({ email, name, id }) {
    if (!email || !name || !id) {
      throw new Error('CREATED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof email !== 'string' || typeof name !== 'string' || typeof id !== 'string') {
      throw new Error('CREATED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreatedUser;
