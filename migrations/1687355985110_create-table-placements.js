/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('placements', {
    midwife_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    jorong_id: {
      type: 'VARCHAR(10)',
      notNull: true,
    },
  });

  pgm.addConstraint('placements', 'pk_midwife_id_and_jorong_id', 'PRIMARY KEY(midwife_id, jorong_id)');
  pgm.addConstraint('placements', 'unique_midwife_id_and_jorong_id', 'UNIQUE(midwife_id, jorong_id)');
  pgm.addConstraint('placements', 'fk_midwife_id', 'FOREIGN KEY(midwife_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropTable('placements');
};
