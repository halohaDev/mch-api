/* eslint-disable camelcase */
exports.up = (pgm) => {
  // create enum type report_status
  pgm.createType("report_status", ["review", "approved", "revision"]);

  pgm.createTable("agg_report_data", {
    id: {
      type: "VARCHAR",
      primaryKey: true,
    },
    chairperson_id: {
      type: "VARCHAR",
      notNull: true,
    },
    placement_id: {
      type: "VARCHAR",
      notNull: true,
    },
    data: {
      type: "jsonb",
      notNull: true,
    },
    reportType: {
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

  pgm.createIndex("agg_report_data", "chairperson_id");
  pgm.createIndex("agg_report_data", "placement_id");
  pgm.createIndex("agg_report_data", "reportType");
  pgm.createIndex("agg_report_data", "approved_at");
  pgm.createIndex("agg_report_data", "created_at");
  pgm.createIndex("agg_report_data", "updated_at");
  pgm.createIndex("agg_report_data", "month");
  pgm.createIndex("agg_report_data", "year");

  pgm.addConstraint(
    "agg_report_data",
    "fk_agg_report_data_chairperson_id",
    "FOREIGN KEY(chairperson_id) REFERENCES users(id)"
  );

  pgm.addConstraint(
    "agg_report_data",
    "fk_agg_report_data_placement_id",
    "FOREIGN KEY(placement_id) REFERENCES placements(id)"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("agg_report_data");
};
