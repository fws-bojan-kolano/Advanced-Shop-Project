const express = require('express');
const {productsController} = require('../controllers/products-controller');
const productsRouter = express.Router();

productsRouter
    .get('/products', productsController.productsControllerGet)
    .get('/products/recommended', productsController.productsControllerGetByRecommended)
    .get('/products/:id', productsController.productsControllerGetById)
    .post('/products/new', productsController.productsControllerAddNew)
    .delete('/products/:id', productsController.productsControllerRemove)
    .put('/products/:id', productsController.productsControllerChange)
    .get('/search', productsController.productsControllerSearch)
    .get('/filters', productsController.productsControllerFilters);

module.exports = {
    productsRouter
}