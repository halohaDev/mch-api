/* eslint-disable camelcase */

exports.up = (pgm) => {
  // create enum type martial_status
  pgm.createType('martial_status', ['single', 'married', 'divorced', 'widowed']);
  // create table maternals
  pgm.createTable('maternals', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    menarche_date: {
      type: 'date',
      notNull: true,
    },
    martial_date: {
      type: 'date',
      notNull: true,
    },
    number_of_marriage: {
      type: 'VARCHAR(3)',
      notNull: true,
    },
    // add martial_status with enum martial_status
    martial_status: {
      type: 'martial_status',
      notNull: true,
      defaultValue: 'single',
    },
  });
};

exports.down = (pgm) => {
  // drop table maternals
  pgm.dropTable('maternals');
  // drop enum type martial_status
  pgm.dropType('martial_status');
};
