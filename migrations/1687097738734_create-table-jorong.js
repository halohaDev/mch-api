/* eslint-disable camelcase */

exports.up = (pgm) => {
  // create table jorong related to nagari
  pgm.createTable('jorong', {
    id: {
      type: 'VARCHAR(10)',
      primaryKey: true,
    },
    nagari_id: {
      type: 'VARCHAR(10)',
      notNull: true,
    },
    name: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  // drop table jorong
  pgm.dropTable('jorong');
};
