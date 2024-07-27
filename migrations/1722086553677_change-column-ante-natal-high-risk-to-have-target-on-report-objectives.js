/* eslint-disable camelcase */

exports.up = (pgm) => {
  // change column name from ante_natal_high_risk to ante_natal_high_risk_target
  pgm.renameColumn("report_objectives", "ante_natal_high_risk", "ante_natal_high_risk_target");
};

exports.down = (pgm) => {
  // change column name from ante_natal_high_risk_target to ante_natal_high_risk
  pgm.renameColumn("report_objectives", "ante_natal_high_risk_target", "ante_natal_high_risk");
};
