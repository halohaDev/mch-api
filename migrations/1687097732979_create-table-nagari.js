/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // create table nagari
  pgm.createTable('nagari', {
    id: {
      type: 'VARCHAR(10)',
      primaryKey: true,
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  // drop table nagari
  pgm.dropTable('nagari');
};
