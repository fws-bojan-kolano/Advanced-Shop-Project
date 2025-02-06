const express = require('express');
const {usersController} = require('../controllers/users-controller');
const usersRouter = express.Router();

usersRouter
    .get('/users', usersController.usersControllerGet)
    .post('/users', usersController.usersLoginController);

module.exports = {
    usersRouter
}