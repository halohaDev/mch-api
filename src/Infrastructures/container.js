/* istanbul ignore file */

// const { createContainer } = require('instances-container');
// awilix import
const {
  createContainer, asClass, asValue, InjectionMode,
} = require('awilix');

// external
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');
const pool = require('./database/postgres/pool');

// service
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');

// user case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const UserRepository = require('../Domains/users/UserRepository');
const PasswordHash = require('../Applications/security/PasswordHash');

// creating container
const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

// registering services
container.register({
  userRepository: asClass(UserRepository).singleton(),
  passwordHash: asClass(PasswordHash).singleton(),
  addUserUseCase: asClass(AddUserUseCase).singleton(),
  userRepositoryPostgres: asClass(UserRepositoryPostgres).singleton(),
  bcryptPasswordHash: asClass(BcryptPasswordHash).singleton(),
});

container.register({
  pool: asValue(pool),
  idGenerator: asValue(nanoid),
  bcrypt: asValue(bcrypt),
});
