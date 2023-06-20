/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthRepositoryPostgres = require('./repository/AuthRepositoryPostgres');
const NagariRepositoryPostgres = require('./repository/NagariRepositoryPostgres');
const JorongRepositoryPostgres = require('./repository/JorongRepositoryPostgres');

// external
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JsonWebToken = require('./security/JsonWebToken');

// interface
const UserRepository = require('../Domains/users/UserRepository');
const AuthRepository = require('../Domains/auth/AuthRepository');
const NagariRepository = require('../Domains/nagari/NagariRepository');
const JorongRepository = require('../Domains/jorong/JorongRepository');

// user case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const PasswordHash = require('../Applications/security/PasswordHash');
const AuthTokenManager = require('../Applications/security/AuthTokenManager');
const AuthUseCase = require('../Applications/use_case/AuthUseCase');
const NagariUseCase = require('../Applications/use_case/NagariUseCase');
const JorongUseCase = require('../Applications/use_case/JorongUseCase');

const container = createContainer();

container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },

  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },

  {
    key: AuthRepository.name,
    Class: AuthRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
      ],
    },
  },

  {
    key: AuthTokenManager.name,
    Class: JsonWebToken,
    parameter: {
      dependencies: [
        {
          concrete: jwt.token,
        },
      ],
    },
  },
  {
    key: NagariRepository.name,
    Class: NagariRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: JorongRepository.name,
    Class: JorongRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
]);

// use case
container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
      ],
    },
  },

  {
    key: AuthUseCase.name,
    Class: AuthUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authRepository',
          internal: AuthRepository.name,
        },
        {
          name: 'userRepository',
          internal: UserRepository.name,
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name,
        },
        {
          name: 'tokenManager',
          internal: AuthTokenManager.name,
        },
      ],
    },
  },

  {
    key: NagariUseCase.name,
    Class: NagariUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'nagariRepository',
          internal: NagariRepository.name,
        },
      ],
    },
  },
  {
    key: JorongUseCase.name,
    Class: JorongUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'jorongRepository',
          internal: JorongRepository.name,
        },
        {
          name: 'nagariRepository',
          internal: NagariRepository.name,
        },
      ],
    },
  },
]);

module.exports = container;
