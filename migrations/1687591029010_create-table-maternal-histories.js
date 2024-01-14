/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  // create type enum maternal_status
  pgm.createType('maternal_status', ['pregnant', 'not_pregnant', 'abortion', 'postpartum']);

  // create table maternal_histories
  pgm.createTable('maternal_histories', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    maternal_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    period_duration: {
      type: 'integer',
    },
    period_amount: {
      type: 'integer',
    },
    period_concern: {
      type: 'TEXT',
    },
    period_cycle: {
      type: 'integer',
    },
    last_illness: {
      type: 'TEXT',
    },
    current_illness: {
      type: 'TEXT',
    },
    gemeli: {
      type: 'BOOLEAN',
    },
    edd: {
      type: 'date',
    },
    hpht: {
      type: 'date',
    },
    weight_before_pregnancy: {
      type: 'float',
    },
    maternal_status: {
      type: 'maternal_status',
      notNull: true,
      defaultValue: 'not_pregnant',
    },
  });
};

exports.down = (pgm) => {
  // drop table maternal_histories
  pgm.dropTable('maternal_histories');
  // drop type enum maternal_status
  pgm.dropType('maternal_status');
};
