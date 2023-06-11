const DomainTranslatorError = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    expect(DomainTranslatorError.translate(new Error('CREATE_USER.NOT_CONTAIN_NEEDED_PROPERTY'))).toStrictEqual(new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'));
    expect(DomainTranslatorError.translate(new Error('CREATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION'))).toStrictEqual(new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'));
    expect(DomainTranslatorError.translate(new Error('CREATE_USER.EMAIL_IS_NOT_VALID'))).toStrictEqual(new InvariantError('tidak dapat membuat user baru karena email tidak valid'));
  });

  it('should return original error when error is not recognized', () => {
    // Arrange
    const originalError = new Error('some_error');

    // Action
    const translatedError = DomainTranslatorError.translate(originalError);

    // Assert
    expect(translatedError).toStrictEqual(originalError);
  });
});
