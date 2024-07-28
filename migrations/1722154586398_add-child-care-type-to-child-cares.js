/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // add child care type enum
  pgm.createType("child_care_types", ["kn1", "kn2", "kn3", "balita", "bayi", "prasekolah"]);

  pgm.addColumns("child_cares", {
    child_care_type: {
      type: "child_care_types",
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("child_cares", "child_care_type");
  pgm.dropType("child_care_types");
};
