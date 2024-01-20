/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // change column martial_date to marital_date
  pgm.renameColumn("maternals", "martial_date", "marital_date");

  // change column martial_status to marital_status
  pgm.renameColumn("maternals", "martial_status", "marital_status");
};

exports.down = (pgm) => {
  // change column marital_date to martial_date
  pgm.renameColumn("maternals", "marital_date", "martial_date");

  // change column marital_status to martial_status
  pgm.renameColumn("maternals", "marital_status", "martial_status");
};
