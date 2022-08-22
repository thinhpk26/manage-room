const express = require('express')
const SignUpRouter = express.Router()
const {getSignUp} = require('../controller/signUp.controller')

SignUpRouter.get('/', getSignUp)

module.exports = SignUpRouter
