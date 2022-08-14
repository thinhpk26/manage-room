const express = require('express');
const { getInforBasicRoom } = require('../controller/room.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roomRouter = express.Router();

roomRouter.get('/basic-infor', authMiddleware, getInforBasicRoom)

module.exports = roomRouter