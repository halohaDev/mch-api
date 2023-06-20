class ShowJorong {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, name, nagariId } = payload;

    this.id = id;
    this.name = name;
    this.nagariId = nagariId;
  }

  _verifyPayload({ id, name, nagariId }) {
    if (!id || !name || !nagariId) {
      throw new Error('SHOW_JORONG.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof name !== 'string' || typeof nagariId !== 'string') {
      throw new Error('SHOW_JORONG.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = ShowJorong;
