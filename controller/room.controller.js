const connectionMySql = require("../Models/connectMySql")

module.exports = {
    getInforBasicRoom(req, res, next) {
        const {roomID, nameRoom, accountMoneyRemain} = req.inforMember
        res.send({roomID, nameRoom, accountMoneyRemain})
    }
}