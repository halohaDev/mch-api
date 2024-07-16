const ClientError = require('./ClientError');

class AuthorizationError extends ClientError {
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
    
    if (message === undefined) {
      this.message = 'You\'re not authorized to access this resource';
    }
  }
}

module.exports = AuthorizationError;
