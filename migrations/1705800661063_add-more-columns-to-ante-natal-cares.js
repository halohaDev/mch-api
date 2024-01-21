/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("ante_natal_cares", {
    date_of_visit: {
      type: "timestamp",
      notNull: true,
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
