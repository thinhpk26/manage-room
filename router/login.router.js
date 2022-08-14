const express = require('express');
const {postMiddleware} = require('../middleware/login.middleware');
const {postLogin, getLogin} = require('../controller/login.controller')
const login = express.Router()

login.post('/', postMiddleware, postLogin)
login.get('/', getLogin)

module.exports = login