class CreateNagari {
  constructor(payload) {
    this._verifyPayload(payload);

    const { name } = payload;

    this.name = name;
  }

  _verifyPayload({ name }) {
    if (!name) {
      throw new Error('CREATE_NAGARI.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof name !== 'string') {
      throw new Error('CREATE_NAGARI.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateNagari;
