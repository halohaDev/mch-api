/* eslint-disable camelcase */
exports.up = (pgm) => {
  // create enum type report_status
  pgm.createType("report_status", ["review", "approved", "revision"]);

  pgm.createTable("agg_report_data", {
    id: {
      type: "VARCHAR",
      primaryKey: true,
    },
    approved_by: {
      type: "VARCHAR",
      notNull: true,
    },
    jorong_id: {
      type: "VARCHAR",
      notNull: true,
    },
    midwife_id: {
      type: "VARCHAR",
      notNull: true,
    },
    data: {
      type: "jsonb",
      notNull: true,
    },
    report_type: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    approved_at: {
      type: "timestamp",
    },
    status: {
      type: "report_status",
      notNull: true,
      default: "review",
    },
    note: {
      type: "VARCHAR(255)",
    },
    month: {
      type: "INTEGER",
      notNull: true,
    },
    year: {
      type: "INTEGER",
      notNull: true,
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

  pgm.createIndex("agg_report_data", "approved_by");
  pgm.createIndex("agg_report_data", "report_type");
  pgm.createIndex("agg_report_data", "approved_at");
  pgm.createIndex("agg_report_data", "created_at");
  pgm.createIndex("agg_report_data", "updated_at");
  pgm.createIndex("agg_report_data", "month");
  pgm.createIndex("agg_report_data", "year");
  pgm.createIndex("agg_report_data", "midwife_id");
  pgm.createIndex("agg_report_data", "jorong_id");

  pgm.addConstraint(
    "agg_report_data",
    "fk_agg_report_data_approved_by",
    "FOREIGN KEY(approved_by) REFERENCES users(id)"
  );

  pgm.addConstraint(
    "agg_report_data",
    "fk_agg_report_data_midwife_id",
    "FOREIGN KEY(midwife_id) REFERENCES users(id)"
  );

  pgm.addConstraint(
    "agg_report_data",
    "fk_agg_report_data_jorong_id",
    "FOREIGN KEY(jorong_id) REFERENCES jorong(id)"
  );

  pgm.addConstraint(
    "agg_report_data",
    "report_unique",
    "UNIQUE(midwife_id, jorong_id, report_type, month, year)"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("agg_report_data");
  pgm.dropType("report_status");
};
