const express = require('express');
const { getInforBasicRoom, getRequestIntoRoom, putConfirm, deleteRequest } = require('../controller/room.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roomRouter = express.Router();

roomRouter.get('/basic-infor', authMiddleware, getInforBasicRoom)
roomRouter.get('/request-room', authMiddleware, getRequestIntoRoom)
roomRouter.put('/confirm-request', authMiddleware, putConfirm)
roomRouter.delete('/cancel-request', authMiddleware, deleteRequest)

module.exports = roomRouter