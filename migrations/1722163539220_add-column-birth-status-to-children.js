/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // add enum birth_status
  pgm.createType("birth_status", ["alive", "dead"]);

  pgm.addColumns("children", {
    birth_status: {
      type: "birth_status",
      notNull: true,
      default: "alive",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns("children", "birth_status");

  pgm.dropType("birth_status");
};
