/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // add new enum value to report status
  pgm.sql("ALTER TYPE report_status ADD VALUE 'draft'");
};

exports.down = (pgm) => {};
