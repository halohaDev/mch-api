/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // change contact_type to post_natal_type with value from post_natal_types
  pgm.sql(`
    ALTER TABLE post_natal_cares
    RENAME COLUMN contact_type TO post_natal_type;
  `);

  pgm.sql(`
    ALTER TABLE post_natal_cares
    ALTER COLUMN post_natal_type TYPE post_natal_types
    USING post_natal_type::text::post_natal_types;
  `);
};

exports.down = pgm => {
  // change post_natal_type to contact_type
  pgm.sql(`
    ALTER TABLE post_natal_cares
    RENAME COLUMN post_natal_type TO contact_type;
  `);

  pgm.sql(`
    ALTER TABLE post_natal_cares
    ALTER COLUMN contact_type TYPE contact_types
    USING contact_type::text::contact_types;
  `);
};
