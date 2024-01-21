/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("maternals", {
    jorong_id: {
      type: "string",
      notNull: true,
    },
  });

  pgm.addConstraint(
    "maternals",
    "fk_maternal.location_jorong_id",
    "FOREIGN KEY(jorong_id) REFERENCES jorong(id) ON DELETE CASCADE"
  );

  pgm.createIndex("maternals", "jorong_id");
};

exports.down = (pgm) => {
  pgm.dropColumns("maternals", ["jorong_id"]);
};
