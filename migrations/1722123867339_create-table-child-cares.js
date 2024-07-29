/* eslint-disable camelcase */

const { on } = require("nodemon");

exports.shorthands = undefined;

exports.up = (pgm) => {
  // create with column id, child_id, jorong_id, midwife_id, weight, height, head_circumference, notes, service_data, created_at, updated_at
  pgm.createTable("child_cares", {
    id: {
      type: "VARCHAR",
      primaryKey: true,
    },
    child_id: {
      type: "VARCHAR",
      notNull: true,
    },
    jorong_id: {
      type: "VARCHAR",
      notNull: true,
      references: '"jorong"',
      onDelete: "CASCADE",
    },
    midwife_id: {
      type: "VARCHAR",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    weight: {
      type: "FLOAT",
      notNull: true,
    },
    height: {
      type: "FLOAT",
      notNull: true,
    },
    head_circumference: {
      type: "FLOAT",
      notNull: true,
    },
    notes: {
      type: "TEXT",
      notNull: true,
    },
    date_of_visit: {
      type: "DATE",
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
};

exports.down = (pgm) => {};
