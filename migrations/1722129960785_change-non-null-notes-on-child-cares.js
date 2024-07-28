/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn("child_cares", "notes", {
    notNull: false,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn("child_cares", "notes", {
    notNull: true,
  });
};
