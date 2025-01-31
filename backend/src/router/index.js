const { usersRouter } = require('./users-router');
const { exampleRouter } = require('./example-router');

module.exports = {
  router: [exampleRouter, usersRouter],
};
