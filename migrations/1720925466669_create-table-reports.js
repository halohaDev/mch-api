/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createType("report_types", ["jorong_monthly", "pws_ibu", "pws_anak"]);

  pgm.createTable("reports", {
    id: {
      type: "VARCHAR",
      primaryKey: true,
    },
    report_type: {
      type: "report_types",
      notNull: true,
    },
    jorong_id: {
      type: "VARCHAR",
    },
    requested_by: {
      type: "VARCHAR",
      references: "users",
      notNull: true,
    },
    approved_by: {
      type: "VARCHAR",
      references: "users",
      notNull: false,
    },
    aggregated_data: {
      type: "jsonb",
      defaultValues: "{}",
    },
    status: {
      type: "report_status",
      notNull: true,
      default: "review",
    },
    note: {
      type: "TEXT",
    },
    month: {
      type: "INTEGER",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
    },
    approved_at: {
      type: "timestamp",
      default: pgm.func("current_timestamp"),
    },
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

  pgm.createIndex("reports", "report_type");
  pgm.createIndex("reports", "jorong_id");
  pgm.createIndex("reports", "requested_by");
  pgm.createIndex("reports", "approved_by");
  pgm.createIndex("reports", "status");
  pgm.createIndex("reports", ["requested_by", "jorong_id", "report_type"]);
  pgm.createIndex("reports", ["requested_by", "jorong_id", "report_type", "month", "year", "status"]);
  pgm.createIndex("reports", ["month", "year", "report_type"]);
  pgm.createIndex("reports", "created_at");
};

exports.down = (pgm) => {
  pgm.dropTable("reports");
  pgm.dropType("report_types");
};
