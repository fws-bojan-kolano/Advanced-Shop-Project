const express = require('express');
const {locationsController} = require('../controllers/locations-controller');
const locationsRouter = express.Router();

locationsRouter
    .get('/locations', locationsController.locationsControllerGet);

module.exports = {
    locationsRouter
}