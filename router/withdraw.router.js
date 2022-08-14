const express = require('express')
const { get, postToGetHistoryWithdraw, postToAddWithdraw, putWithdraw, deleteWithdraw,postGetFilterWithdraw} = require('../controller/withdraw.controller')
const authMiddleware = require('../middleware/auth.middleware')
const withdrawRouter = express.Router()

withdrawRouter.get('/', authMiddleware, get)
withdrawRouter.post('/history-withdraw', authMiddleware, postToGetHistoryWithdraw)
withdrawRouter.post('/filter-history-withdraw', authMiddleware, postGetFilterWithdraw)
withdrawRouter.post('/', authMiddleware, postToAddWithdraw)
withdrawRouter.put('/', authMiddleware, putWithdraw)
withdrawRouter.delete('/', authMiddleware, deleteWithdraw)

module.exports = withdrawRouter