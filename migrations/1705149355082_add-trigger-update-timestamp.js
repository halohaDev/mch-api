/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // add trigger to update timestamp
  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `);

  pgm.sql(`
    CREATE TRIGGER update_maternal_histories_timestamp BEFORE UPDATE
    ON maternal_histories FOR EACH ROW EXECUTE PROCEDURE
    update_timestamp();
  `);

  pgm.sql(`
    CREATE TRIGGER update_ante_natal_cares_timestamp BEFORE UPDATE
    ON ante_natal_cares FOR EACH ROW EXECUTE PROCEDURE
    update_timestamp();
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TRIGGER update_maternal_histories_timestamp ON maternal_histories;
  `);

  pgm.sql(`
    DROP TRIGGER update_ante_natal_cares_timestamp ON ante_natal_cares;
  `);

  pgm.sql(`
    DROP FUNCTION update_timestamp();
  `);
};
