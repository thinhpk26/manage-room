const express = require('express')
const { getPurchase, postToGetHistoryPurchase, postPurchase, putPurchase, deletePurchase } = require('../controller/purchase.controller')
const authMiddleware = require('../middleware/auth.middleware')
const purchaseRouter = express.Router()

purchaseRouter.get('/', authMiddleware, getPurchase)
purchaseRouter.post('/history-purchase', authMiddleware, postToGetHistoryPurchase)
purchaseRouter.post('/', authMiddleware, postPurchase)
purchaseRouter.put('/', authMiddleware, putPurchase)
purchaseRouter.delete('/', authMiddleware, deletePurchase)

module.exports = purchaseRouter