/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createType("risk_statuses", ["normal", "risk", "high_risk"]);

  pgm.addColumn("maternal_histories", {
    risk_status: {
      type: "risk_statuses",
      notNull: true,
      default: "normal",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("maternal_histories", "risk_status");
  pgm.dropType("risk_statuses");
};
