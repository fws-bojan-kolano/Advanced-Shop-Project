const express = require('express');
const {productsController} = require('../controllers/products-controller');
const productsRouter = express.Router();

productsRouter
    .get('/products', productsController.productsControllerGet)
    .get('/products/recommended', productsController.productsControllerGetByRecommended)
    .get('/products/:id', productsController.productsControllerGetById);

module.exports = {
    productsRouter
}