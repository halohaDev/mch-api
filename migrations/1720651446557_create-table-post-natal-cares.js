/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable("post_natal_cares", {
    id: {
      type: "varchar",
      primaryKey: true,
    },
    blood_pressure: {
      type: "integer",
    },
    temperature: {
      type: "integer",
    },
    vit_a: {
      type: "boolean",
      default: false,
    },
    fe: {
      type: "boolean",
      default: false,
    },
    date_of_visit: {
      type: "datetime",
      default: pgm.func("current_timestamp"),
    },
    maternal_history_id: {
      type: "varchar",
      notNull: true,
      references: '"maternal_histories"',
      onDelete: "cascade",
    },
    jorong_id: {
      type: "varchar",
      notNull: true,
      references: '"jorong"',
      onDelete: "cascade",
    },
    midwife_id: {
      type: "varchar",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    contact_type: {
      type: "contact_types",
    },
    created_at: {
      type: "datetime",
      default: pgm.func("current_timestamp"),
    },
    updated_at: {
      type: "datetime",
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.createIndex("post_natal_cares", "jorong_id");
  pgm.createIndex("post_natal_cares", "midwife_id");
  pgm.createIndex("post_natal_cares", "maternal_history_id");
  pgm.createIndex("post_natal_cares", "date_of_visit");
  pgm.createIndex("post_natal_cares", "created_at");
  pgm.createIndex("post_natal_cares", "updated_at");

  pgm.sql(`
    CREATE TRIGGER update_post_natal_cares_timestamp BEFORE UPDATE
    ON post_natal_cares FOR EACH ROW EXECUTE PROCEDURE
    update_timestamp();  
  `)
};

exports.down = (pgm) => {
  pgm.dropTable("post_natal_cares");
};
