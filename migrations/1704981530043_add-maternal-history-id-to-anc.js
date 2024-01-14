/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("ante_natal_cares", {
    maternal_history_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
  });

  // add index
  pgm.createIndex("ante_natal_cares", "maternal_history_id");
  pgm.createIndex("ante_natal_cares", "placement_id");
};

exports.down = (pgm) => {
  pgm.dropColumns("ante_natal_cares", "maternal_history_id");
};
