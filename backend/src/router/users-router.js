const express = require('express');
const {usersController} = require('../controllers/users-controller');
const usersRouter = express.Router();

usersRouter
    .get('/users', usersController.usersControllerGet)
    .post('/users/login', usersController.usersLoginController)
    .post('/users/register', usersController.usersRegisterController)
    .put('/users/update', usersController.usersUpdateAccountController);

module.exports = {
    usersRouter
}