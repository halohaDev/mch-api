/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addConstraint("jorong", "fk_jorong_village_id", "FOREIGN KEY(nagari_id) REFERENCES nagari(id) ON DELETE CASCADE");
  pgm.addConstraint("placements", "fk_placements_jorong_id", "FOREIGN KEY(jorong_id) REFERENCES jorong(id) ON DELETE CASCADE");
  pgm.addConstraint("reports", "fk_reports_jorong_id", "FOREIGN KEY(jorong_id) REFERENCES jorong(id) ON DELETE CASCADE");
  pgm.addConstraint("maternals", "fk_maternals_user)id", "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE");
};

exports.down = (pgm) => {
  pgm.dropConstraint("jorong", "fk_jorong_village_id");
  pgm.dropConstraint("placements", "fk_placements_jorong_id");
  pgm.dropConstraint("reports", "fk_reports_jorong_id");
  pgm.dropConstraint("maternals", "fk_maternals_user)id");
};
