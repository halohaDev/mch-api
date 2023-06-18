const CreateUser = require('../CreateUser');

describe('CreateUser entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      email: 'user_test@test.com',
      password: 'secret',
    };

    // Action and Assert
    expect(() => new CreateUser(payload)).toThrowError('CREATE_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      email: 'test',
      password: 1,
      name: true,
    };

    // Action and Assert
    expect(() => new CreateUser(payload)).toThrowError('CREATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when email is not in email format', () => {
    // Arrange
    const payload = {
      email: 'test',
      password: 'secret',
      name: 'test mail',
    };

    // Action and Assert
    expect(() => new CreateUser(payload)).toThrowError('CREATE_USER.EMAIL_IS_NOT_VALID');
  });

  it('should create CreateUser object correctly', () => {
    // Arrange
    const payload = {
      email: 'test@mail.com',
      password: 'secret',
      name: 'test mail',
    };

    // Action
    const { email, password, name } = new CreateUser(payload);

    // Assert
    expect(email).toEqual(payload.email);
    expect(password).toEqual(payload.password);
    expect(name).toEqual(payload.name);
  });

  describe('when create user role mother', () => {
    it('should throw error when payload did not contain needed property', () => {
      // Arrange
      const payload = {
        email: 'user-test@mail.com',
        password: 'secret',
        name: 'user test',
        nik: '1234567890123456',
        phoneNumber: '081234567890',
        address: 'user test address',
        dateOfBirth: '1999-12-12',
        birthplace: 'user test birthplace',
        jobTitle: 'user test job title',
        religion: 'user test religion',
        isActiveBpjs: 'true',
        role: 'mother',
      };

      // Action and Assert
      expect(() => new CreateUser(payload)).toThrowError('CREATE_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
      // Arrange
      const payload = {
        email: 'user-test@mail.com',
        password: 'secret',
        name: 'user test',
        nik: '1234567890123456',
        phoneNumber: '081234567890',
        address: 'user test address',
        dateOfBirth: '1999-12-12',
        birthplace: 'user test birthplace',
        jobTitle: 'user test job title',
        religion: 'user test religion',
        isActiveBpjs: 'true',
        bpjsKesehatanNumber: 1234567890123456,
        role: 'mother',
      };

      // Action and Assert
      expect(() => new CreateUser(payload)).toThrowError('CREATE_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when nik is not in nik format', () => {
      const payload = {
        email: 'user-test@mail.com',
        password: 'secret',
        name: 'user test',
        nik: 'abc123',
        phoneNumber: '081234567890',
        address: 'user test address',
        dateOfBirth: '1999-12-12',
        birthplace: 'user test birthplace',
        jobTitle: 'user test job title',
        religion: 'user test religion',
        isActiveBpjs: true,
        bpjsKesehatanNumber: '1234567890123456',
        role: 'mother',
      };

      // Action and Assert
      expect(() => new CreateUser(payload)).toThrowError('CREATE_USER.NIK_IS_NOT_VALID');
    });

    it('should create CreateUser object correctly', () => {
      // Arrange
      const payload = {
        email: 'user-test@mail.com',
        password: 'secret',
        name: 'user test',
        nik: '1234567890123456',
        phoneNumber: '081234567890',
        address: 'user test address',
        dateOfBirth: '1999-12-12',
        birthplace: 'user test birthplace',
        jobTitle: 'user test job title',
        religion: 'user test religion',
        isActiveBpjs: true,
        bpjsKesehatanNumber: '1234567890123456',
        role: 'mother',
      };

      // Action
      const createUser = new CreateUser(payload);

      // Assert
      expect(createUser.email).toEqual(payload.email);
      expect(createUser.password).toEqual(payload.password);
      expect(createUser.name).toEqual(payload.name);
      expect(createUser.nik).toEqual(payload.nik);
      expect(createUser.phoneNumber).toEqual(payload.phoneNumber);
      expect(createUser.address).toEqual(payload.address);
      expect(createUser.dateOfBirth).toEqual(payload.dateOfBirth);
      expect(createUser.birthplace).toEqual(payload.birthplace);
      expect(createUser.jobTitle).toEqual(payload.jobTitle);
      expect(createUser.religion).toEqual(payload.religion);
      expect(createUser.isActiveBpjs).toEqual(payload.isActiveBpjs);
      expect(createUser.bpjsKesehatanNumber).toEqual(payload.bpjsKesehatanNumber);
      expect(createUser.role).toEqual(payload.role);
    });
  });
});
