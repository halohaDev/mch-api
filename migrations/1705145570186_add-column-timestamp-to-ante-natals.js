/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("ante_natal_cares", {
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("ante_natal_cares", "created_at");
  pgm.createIndex("ante_natal_cares", "updated_at");
};

exports.down = (pgm) => {
  pgm.dropColumns("ante_natal_cares", ["created_at", "updated_at"]);
};
