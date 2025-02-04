/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // Rename column
  pgm.renameColumn("ante_natal_cares", "sugar_in_urine", "blood_sugar");

  // change column type
  pgm.alterColumn("ante_natal_cares", "blood_sugar", {
    type: "string",
  });

  pgm.sql(`UPDATE "ante_natal_cares" SET "blood_sugar" = '0'`);

  pgm.alterColumn("ante_natal_cares", "blood_sugar", {
    type: "integer",
    using: "blood_sugar::integer",
  });

  // remove column
  pgm.dropColumns("ante_natal_cares", ["placement_id"]);
};

exports.down = (pgm) => {
  // Rename column
  pgm.renameColumn("ante_natal_cares", "blood_sugar", "sugar_in_urine");

  // change column type
  pgm.alterColumn("ante_natal_cares", "sugar_in_urine", {
    type: "string",
  });

  // add column
  pgm.addColumns("ante_natal_cares", {
    placement_id: {
      type: "string",
    },
  });
};
