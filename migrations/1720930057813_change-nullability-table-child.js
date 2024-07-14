/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.alterColumn("children", "father_name", {
    notNull: false,
  });

  pgm.alterColumn("children", "name", {
    notNull: false,
  });

  pgm.alterColumn("children", "nik", {
    notNull: false,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn("children", "father_name", {
    notNull: true,
  });

  pgm.alterColumn("children", "name", {
    notNull: true,
  });

  pgm.alterColumn("children", "nik", {
    notNull: true,
  });
};
