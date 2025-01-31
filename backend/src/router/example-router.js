// Example
const express = require('express');
const { exampleController } = require('../controllers/example-controller');
const exampleRouter = express.Router();

exampleRouter
  .get('/example', exampleController.exampleControllerGet)
  .post('/example', exampleController.exampleControllerPost)
  .put('/example', exampleController.exampleControllerPut)
  .delete('/example', exampleController.exampleControllerDelete);

module.exports = {
  exampleRouter,
};
