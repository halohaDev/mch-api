/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("users", {
    nip: {
      type: "VARCHAR(50)",
      unique: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("users", "nip");
};
