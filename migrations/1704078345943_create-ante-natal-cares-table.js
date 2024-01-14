/* eslint-disable camelcase */

exports.up = (pgm) => {
  // create enum blood types
  pgm.createType("blood_types", ["A", "B", "AB", "O"]);
  // tt imunization enum
  pgm.createType("tt_imunization", ["0", "1", "2", "3", "4"]);
  // create enum contact_types
  pgm.createType("contact_types", ["c0", "c1", "c2", "c3", "c4", "c5", "c6"]);
  // create enum test results
  pgm.createType("test_results", ["positive", "negative"]);

  pgm.createTable("ante_natal_cares", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    placement_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    weight: {
      type: "FLOAT",
    },
    height: {
      type: "FLOAT",
    },
    hemoglobin: {
      type: "FLOAT",
    },
    blood_pressure: {
      type: "FLOAT",
    },
    fundal_height: {
      type: "FLOAT",
    },
    fetal_heart_rate: {
      type: "FLOAT",
    },
    usg_check_date: {
      type: "DATE",
    },
    temprature: {
      type: "FLOAT",
    },
    action: {
      type: "TEXT",
    },
    blood_type: {
      type: "blood_types",
    },
    tt_imunization: {
      type: "tt_imunization",
    },
    contact_type: {
      type: "contact_types",
    },
    protein_in_urine: {
      type: "test_results",
    },
    sugar_in_urine: {
      type: "test_results",
    },
    hbsag: {
      type: "test_results",
    },
    hiv: {
      type: "test_results",
    },
    syphilis: {
      type: "test_results",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("ante_natal_cares");
  pgm.dropType("blood_types");
  pgm.dropType("tt_imunization");
  pgm.dropType("contact_types");
  pgm.dropType("test_results");
};
