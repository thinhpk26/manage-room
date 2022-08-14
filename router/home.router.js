const express = require('express');
const home = express.Router()
const authMiddleware = require('../middleware/auth.middleware')
const {gethome, getInforOfMember, getTenthPurchaseHistory} = require('../controller/home.controller')

home.get('/', authMiddleware, gethome)
home.get('/getInforOfMember', authMiddleware, getInforOfMember)
home.get('/purchase-history', authMiddleware, getTenthPurchaseHistory)

module.exports = home