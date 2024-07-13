/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createType("complication_types", ["abortus", "hdk", "kpd", "perdarahan", "infeksi", "distosia", "ppp", "others"]);
  pgm.createType("live_conditions", ["alive", "dead"]);

  pgm.createTable("maternal_complications", {
    id: {
      type: "VARCHAR",
      primaryKey: true,
    },
    maternal_history_id: {
      type: "VARCHAR",
      notNull: true,
      references: '"maternal_histories"',
      onDelete: "cascade",
    },
    is_handled: {
      type: "BOOLEAN",
      notNull: true,
      defaultValue: false,
    },
    is_referred: {
      type: "BOOLEAN",
      notNull: true,
      defaultValue: false,
    },
    complication_type: {
      type: "complication_types",
      notNull: true,
    },
    description: {
      type: "TEXT",
    },
    come_condition: {
      type: "live_conditions",
      notNull: true,
      defaultValue: "alive",
    },
    back_condition: {
      type: "live_conditions",
      notNull: true,
      defaultValue: "alive",
    },
    complication_date: {
      type: "DATE",
      notNull: true,
      defaultValue: pgm.func("current_date"),
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

  pgm.createIndex("maternal_complications", "maternal_history_id");
  pgm.createIndex("maternal_complications", "complication_type");
  pgm.createIndex("maternal_complications", "come_condition");
  pgm.createIndex("maternal_complications", "back_condition");
  pgm.createIndex("maternal_complications", "complication_date");
  pgm.createIndex("maternal_complications", "created_at");
  pgm.createIndex("maternal_complications", "updated_at");

  pgm.sql(`
    CREATE TRIGGER update_maternal_complications BEFORE UPDATE
    ON maternal_complications FOR EACH ROW EXECUTE PROCEDURE
    update_timestamp();  
  `);
};

exports.down = (pgm) => {
  pgm.dropTable("maternal_complications");
  pgm.dropType("live_conditions");
  pgm.dropType("complication_types");
};
