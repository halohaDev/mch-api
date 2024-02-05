/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.alterColumn("agg_report_data", "jorong_id", {
    notNull: false,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn("agg_report_data", "jorong_id", {
    notNull: true,
  });
};
