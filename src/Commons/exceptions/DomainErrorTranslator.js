const InvariantError = require("./InvariantError");

const DomainErrorTranslator = {
  translate(error) {
    const newError = DomainErrorTranslator._validationError(error);
    return (
      newError || DomainErrorTranslator._directories[error.message] || error
    );
  },
};

DomainErrorTranslator._validationError = (error) => {
  const { message } = error;
  const validationMessage = message.split(".");

  if (validationMessage[1] === "INPUT_VALIDATION") {
    const valueMessage = validationMessage[0].toLowerCase();
    const errorMessage = validationMessage[2]
      .split("_")
      .join(" ")
      .toLowerCase();

    return new InvariantError(`${valueMessage} ${errorMessage}`);
  }

  return null;
};

DomainErrorTranslator._directories = {
  "CREATE_USER.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada"
  ),
  "CREATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat user baru karena tipe data tidak sesuai"
  ),
  "CREATE_USER.EMAIL_IS_NOT_VALID": new InvariantError(
    "tidak dapat membuat user baru karena email tidak valid"
  ),
  "REFRESH_TOKEN_REPOSITORY.REFRESH_TOKEN_ALREADY_EXISTS": new InvariantError(
    "refresh token sudah ada"
  ),
  "REFRESH_TOKEN_REPOSITORY.NOT_FOUND": new InvariantError(
    "refresh token tidak ditemukan"
  ),
  "AUTH_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN": new InvariantError(
    "harus mengirimkan token refresh"
  ),
  "AUTH_USE_CASE.NOT_CONTAIN_EMAIL_OR_PASSWORD": new InvariantError(
    "harus mengirimkan email dan password"
  ),
  "AUTH_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "autentikasi gagal, payload tidak sesuai"
  ),
  "CREATE_USER.NIK_IS_NOT_VALID": new InvariantError(
    "tidak dapat membuat user baru karena NIK tidak valid"
  ),
  "CREATE_NAGARI.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat nagari baru karena tipe data tidak sesuai"
  ),
  "CREATE_NAGARI.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat nagari baru karena properti yang dibutuhkan tidak ada"
  ),
  "CREATE_JORONG.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat jorong baru karena tipe data tidak sesuai"
  ),
  "CREATE_JORONG.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat jorong baru karena properti yang dibutuhkan tidak ada"
  ),
  "CREATE_PLACEMENT.NOT_MEET_DATA_TYPE_SPECIFICATION": new InvariantError(
    "tidak dapat membuat penempatan baru karena tipe data tidak sesuai"
  ),
  "CREATE_PLACEMENT.NOT_CONTAIN_NEEDED_PROPERTY": new InvariantError(
    "tidak dapat membuat penempatan baru karena properti yang dibutuhkan tidak ada"
  ),
};

module.exports = DomainErrorTranslator;
