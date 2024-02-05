/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn("reports", "jorong_id", {
    notNull: false,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn("reports", "jorong_id", {
    notNull: true,
  });
};
