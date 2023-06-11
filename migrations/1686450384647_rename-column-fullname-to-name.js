/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.renameColumn('users', 'fullname', 'name');
};

exports.down = (pgm) => {
  pgm.renameColumn('users', 'name', 'fullname');
};
