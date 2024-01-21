/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // add enum value to test results
  pgm.sql(
    "ALTER TYPE test_results ADD VALUE 'positive_non_test' AFTER 'negative'"
  );
};

exports.down = (pgm) => {
  // add enum value to test results
  pgm.sql("DELETE FROM test_results WHERE test_results = 'positive_non_test'");
};
