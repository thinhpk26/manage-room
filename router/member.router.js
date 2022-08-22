const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const memberRouter = express.Router();
const {getBasicInfor, getAllMember, postGetAccount, postCreateUser} = require('../controller/member.controller')

memberRouter.get('/basic-infor', authMiddleware, getBasicInfor)
memberRouter.post('/remainMoney', authMiddleware, postGetAccount)
memberRouter.get('/all-member', authMiddleware, getAllMember)
memberRouter.post('/create-user', postCreateUser)
module.exports = memberRouter