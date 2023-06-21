class CreatePlacement {
  constructor(payload) {
    this._verifyPayload(payload);

    const { midwifeId, jorongId, placementDate } = payload;

    this.midwifeId = midwifeId;
    this.jorongId = jorongId;
    this.placementDate = placementDate;
  }

  _verifyPayload({ midwifeId, jorongId, placementDate }) {
    if (!midwifeId || !jorongId || !placementDate) {
      throw new Error('CREATE_PLACEMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof midwifeId !== 'string'
      || typeof jorongId !== 'string'
      || typeof placementDate !== 'string'
    ) {
      throw new Error('CREATE_PLACEMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreatePlacement;
