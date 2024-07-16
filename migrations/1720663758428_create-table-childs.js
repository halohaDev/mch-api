/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createType("delivery_places", ["rs", "puskesmas", "rumah", "bps", "polindes", "pustu", "klinik", "poskesri"]);
  pgm.createType("delivery_methods", ["normal", "sc", "vakum", "forceps"]);
  pgm.createType("helpers", ["dokter", "bidan", "perawat", "dukun"]);

  pgm.createTable("children", {
    id: {
      type: "varchar",
      primaryKey: true,
    },
    name: {
      type: "varchar",
      notNull: true,
    },
    nik: {
      type: "varchar(16)",
      notNull: true,
    },
    birth_datetime: {
      type: "datetime",
      notNull: true,
    },
    birth_weight: {
      type: "float",
      notNull: true,
    },
    birth_height: {
      type: "float",
      notNull: true,
    },
    gender: {
      type: "varchar(1)",
      notNull: true,
    },
    father_name: {
      type: "varchar",
    },
    pregnancy_age: {
      type: "int",
      notNull: true,
    },
    delivery_place: {
      type: "delivery_places",
      notNull: true,
    },
    delivery_method: {
      type: "delivery_methods",
      notNull: true,
    },
    helper: {
      type: "helpers",
      notNull: true,
    },
    maternal_id: {
      type: "varchar",
      notNull: true,
      references: '"maternals"',
      onDelete: "cascade",
    },
    maternal_history_id: {
      type: "varchar",
      references: '"maternal_histories"',
      onDelete: "cascade",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("children");
  pgm.dropType("delivery_places");
  pgm.dropType("delivery_methods");
  pgm.dropType("helpers");
};
