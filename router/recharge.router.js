const express = require('express');
const { getRecharge, postToGetHistoryRecharge, postToRecharge, putRecharge, deleteRecharge, postGetFilterRecharge} = require('../controller/recharge.controller');
const authMiddleware = require('../middleware/auth.middleware');
const rechargeRouter = express.Router();

rechargeRouter.get('/', authMiddleware, getRecharge)
rechargeRouter.post('/', authMiddleware, postToRecharge)
rechargeRouter.put('/', authMiddleware, putRecharge)
rechargeRouter.delete('/', authMiddleware, deleteRecharge)
// Lấy lịch sử nạp tiền
rechargeRouter.post('/history-recharge', authMiddleware, postToGetHistoryRecharge)
// Lọc lịch sư nạp tiền
rechargeRouter.post('/filter-history-recharge', authMiddleware, postGetFilterRecharge)

module.exports = rechargeRouter