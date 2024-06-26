const routes = (handler) => ([
  {
    method: 'POST',
    path: '/api/v1/jorong',
    handler: handler.postJorongHandler,
    options: {
      app: {
        access: ['admin'],
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/jorong',
    handler: handler.getJorongHandler,
    options: {
      app: {
        access: ['admin', 'midwife', 'chairperson']
      }
    }
  }
]);

module.exports = routes;
