/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.addConstraint("reports", "unique_jorong_id_report_type_month_year", {
    unique: ["jorong_id", "report_type", "month", "year"],
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("reports", "unique_jorong_id_report_type_month_year");
};
