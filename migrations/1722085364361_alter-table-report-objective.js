/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // delivered_baby_alive_target,neo_resti_target,balita_target,pra_sekolah_target

  pgm.addColumns("report_objectives", {
    delivered_baby_alive_target: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    neo_resti_target: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    balita_target: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    pra_sekolah_target: {
      type: "integer",
      notNull: true,
      default: 0,
    },
    jorong_id: {
      type: "varchar",
      references: '"jorong"',
      onDelete: "CASCADE",
    },
  });

  // add unique to jorong_id, report_year
  pgm.addConstraint("report_objectives", "unique_jorong_id_report_year", {
    unique: ["jorong_id", "report_year"],
  });

  // remove column id
  pgm.dropColumns("report_objectives", ["id"]);

  // add column id become uuid primary key
  pgm.addColumns("report_objectives", {
    id: {
      type: "uuid",
      notNull: true,
      default: pgm.func("gen_random_uuid()"),
      primaryKey: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("report_objectives", [
    "delivered_baby_alive_target",
    "neo_resti_target",
    "balita_target",
    "pra_sekolah_target",
    "jorong_id",
  ]);

  // drop id
  pgm.dropColumns("report_objectives", ["id"]);

  // add column id become varchar primary key
  pgm.addColumns("report_objectives", {
    id: {
      type: "varchar",
      notNull: true,
      primaryKey: true,
    },
  });
};
