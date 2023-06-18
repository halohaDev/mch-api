/* eslint-disable camelcase */
exports.up = (pgm) => {
  // add enum type
  pgm.createType('roles', ['mother', 'admin', 'midwife', 'chairperson', 'coordinator', 'relatives']);
  pgm.addColumns('users', {
    role: {
      type: 'roles',
      defaultValue: 'mother',
    },
    nik: {
      type: 'VARCHAR(16)',
      unique: true,
    },
    phone_number: {
      type: 'VARCHAR(16)',
      unique: true,
    },
    address: {
      type: 'TEXT',
    },
    date_of_birth: {
      type: 'DATE',
    },
    birthplace: {
      type: 'VARCHAR(50)',
    },
    job_title: {
      type: 'VARCHAR(50)',
    },
    religion: {
      type: 'VARCHAR(50)',
    },
    is_active_bpjs: {
      type: 'BOOLEAN',
      defaultValue: false,
    },
    bpjs_kesehatan_number: {
      type: 'VARCHAR(50)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumns('users', ['role', 'nik', 'phone_number', 'address', 'date_of_birth', 'birthplace', 'job_title', 'religion', 'is_active_bpjs', 'bpjs_kesehatan_number']);
  pgm.dropType('roles');
};
