const express = require('express')
const actionUser = express.Router()
const {postRecharge, putRecharge, deleteRecharge, postPurchase, putPurchase, deletePurchase, postWithdrawMoney} = require('../controller/actionUser.controller')
const authMiddleware = require('../middleware/auth.middleware')

actionUser.post('/recharge-money', authMiddleware, postRecharge)
actionUser.put('/recharge-money', authMiddleware, putRecharge)
actionUser.delete('/recharge-money', authMiddleware, deleteRecharge)
actionUser.post('/withdraw-money', authMiddleware, postWithdrawMoney)
actionUser.post('/purchase', authMiddleware, postPurchase)
actionUser.put('/purchase', authMiddleware, putPurchase)
actionUser.delete('/purchase', authMiddleware, deletePurchase)

module.exports = actionUser