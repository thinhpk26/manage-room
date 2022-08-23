const express = require('express');
const { getInforBasicRoom, getRequestIntoRoom, putConfirm, deleteRequest, getAllRoomOfUser, postRequestIntoRoom } = require('../controller/room.controller')
const {postMiddleware} = require('../middleware/login.middleware')
const authMiddleware = require('../middleware/auth.middleware');
const roomRouter = express.Router();

roomRouter.get('/basic-infor', authMiddleware, getInforBasicRoom)
roomRouter.post('/get-all-room-of-user', postMiddleware, getAllRoomOfUser)
roomRouter.post('/send-request', postMiddleware, postRequestIntoRoom)
roomRouter.get('/request-room', authMiddleware, getRequestIntoRoom)
roomRouter.put('/confirm-request', authMiddleware, putConfirm)
roomRouter.delete('/cancel-request', authMiddleware, deleteRequest)

module.exports = roomRouter