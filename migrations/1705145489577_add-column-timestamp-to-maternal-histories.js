/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumns("maternal_histories", {
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

  pgm.createIndex("maternal_histories", "created_at");
  pgm.createIndex("maternal_histories", "updated_at");
};

exports.down = (pgm) => {
  pgm.dropColumns("maternal_histories", ["created_at", "updated_at"]);
};
