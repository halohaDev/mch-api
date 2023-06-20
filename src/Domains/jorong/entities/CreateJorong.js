class CreateJorong {
  constructor(payload) {
    this._verifyPayload(payload);

    const { name, nagariId } = payload;

    this.name = name;
    this.nagariId = nagariId;
  }

  _verifyPayload({ name, nagariId }) {
    if (!name || !nagariId) {
      throw new Error('CREATE_JORONG.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof name !== 'string' || typeof nagariId !== 'string') {
      throw new Error('CREATE_JORONG.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateJorong;
