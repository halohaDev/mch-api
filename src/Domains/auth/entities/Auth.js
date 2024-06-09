class Auth {
  constructor(payload) {
    this._verifyPayload(payload);

    this.accessToken = payload.accessToken;
    this.refreshToken = payload.refreshToken;
    this.userId = payload.userId;
  }

  _verifyPayload(payload) {
    const { accessToken, refreshToken, userId } = payload;

    if (!accessToken || !refreshToken) {
      throw new Error('AUTH.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
      throw new Error('AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (userId && typeof userId !== 'string') {
      throw new Error('AUTH.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Auth;
