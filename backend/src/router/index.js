const { usersRouter } = require('./users-router');
const { productsRouter } = require('./products-router');
const { exampleRouter } = require('./example-router');

module.exports = {
  router: [
    exampleRouter,
    usersRouter,
    productsRouter
  ]
};
