const { usersRouter } = require('./users-router');
const { productsRouter } = require('./products-router');
const { locationsRouter } = require('./locations-router');
const { exampleRouter } = require('./example-router');

module.exports = {
  router: [
    exampleRouter,
    usersRouter,
    productsRouter,
    locationsRouter
  ]
};
