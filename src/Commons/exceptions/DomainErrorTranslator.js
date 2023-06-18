const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'CREATE_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'CREATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'CREATE_USER.EMAIL_IS_NOT_VALID': new InvariantError('tidak dapat membuat user baru karena email tidak valid'),
  'REFRESH_TOKEN_REPOSITORY.REFRESH_TOKEN_ALREADY_EXISTS': new InvariantError('refresh token sudah ada'),
  'REFRESH_TOKEN_REPOSITORY.NOT_FOUND': new InvariantError('refresh token tidak ditemukan'),
  'AUTH_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
  'AUTH_USE_CASE.NOT_CONTAIN_EMAIL_OR_PASSWORD': new InvariantError('harus mengirimkan email dan password'),
  'AUTH_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('autentikasi gagal, payload tidak sesuai'),
  'CREATE_USER.NIK_IS_NOT_VALID': new InvariantError('tidak dapat membuat user baru karena NIK tidak valid'),
};

module.exports = DomainErrorTranslator;
