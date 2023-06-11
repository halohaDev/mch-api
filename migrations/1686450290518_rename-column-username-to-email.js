/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameColumn('users', 'username', 'email');
};

exports.down = (pgm) => {
  pgm.renameColumn('users', 'email', 'username');
};
