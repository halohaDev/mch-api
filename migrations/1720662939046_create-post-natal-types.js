/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // create enum
  pgm.createType('post_natal_types', [
    'pnc_1',
    'pnc_2',
    'pnc_3',
    'pnc_4',
  ]);
};

exports.down = pgm => {
  // drop enum
  pgm.dropType('post_natal_types');
};
