/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("report_objectives", {
    id: {
      type: "VARCHAR",
      primaryKey: true,
    },
    report_year: {
      type: "INT",
      notNull: true,
    },
    ante_natal_target: {
      type: "INT",
      notNull: true,
    },
    delivery_target: {
      type: "INT",
      notNull: true,
    },
    ante_natal_high_risk: {
      type: "INT",
      notNull: true,
    },
    baby_target: {
      type: "INT",
      notNull: true,
    },
    post_natal_target: {
      type: "INT",
      notNull: true,
    },
    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("report_types", "name");
  pgm.createIndex("report_types", "report_year");
};

exports.down = (pgm) => {};
