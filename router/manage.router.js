const express = require('express')
const { getManage, checkHost } = require('../controller/manage.controller')
const authMiddleware = require('../middleware/auth.middleware')
const manageRouter = express.Router()

manageRouter.get('/', authMiddleware, checkHost, getManage)
module.exports = manageRouter