/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("ante_natal_cares", {
    date_of_visit: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    art_given: {
      type: "boolean",
    },
    upper_arm_circumference: {
      type: "integer",
    },
    jorong_id: {
      type: "string",
      references: "jorong",
    },
    midwife_id: {
      type: "string",
      references: "users",
    },
  });

  // index jorong_id, midwife_id
  pgm.createIndex("ante_natal_cares", "jorong_id");
  pgm.createIndex("ante_natal_cares", "midwife_id");
  pgm.createIndex("ante_natal_cares", "date_of_visit");
};

exports.down = (pgm) => {
  pgm.dropColumns("ante_natal_cares", [
    "date_of_visit",
    "art_given",
    "upper_arm_circumference",
    "jorong_id",
    "midwife_id",
  ]);
};
