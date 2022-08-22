const connectionMySql = require("../Models/connectMySql")

module.exports = {
    getInforBasicRoom(req, res, next) {
        const {roomID, nameRoom, accountMoneyRemain} = req.inforMember
        res.send({roomID, nameRoom, accountMoneyRemain})
    },
    getRequestIntoRoom(req, res, next) {
        const roomID = req.inforMember.roomID
        connectionMySql.query(`select member.memberID, requestIntoRoom.note, member.name
        from room join requestIntoRoom on room.roomID = requestIntoRoom.roomID
                join member on member.memberID = requestIntoRoom.memberID
        where room.roomID = '${roomID}'`, (err, result) => {
            if(err) return res.status(500).send(err.message)
            else {
                res.send(result)
            }
        })
    },
    putConfirm(req, res, next) {
        const memberIDRequest = req.body.memberID
        const roomID = req.inforMember.roomID
        connectionMySql.beginTransaction((err) => {
            if(err) return res.status(500).send(err.message)
            else {
                connectionMySql.query(`delete from requestIntoRoom
                where requestIntoRoom.roomID = '${roomID}' and requestIntoRoom.memberID = '${memberIDRequest}'`, (err, result) => {
                    if(err) return connectionMySql.rollback(() => {
                        console.log(1)
                        return res.status(500).send(err.message)
                    })
                    connectionMySql.query(`insert into host(memberID, roomID, host)
                    values
                    ('${memberIDRequest}', '${roomID}', false)`, (err, result) => {
                        if(err) return connectionMySql.rollback(() => {
                            return res.status(500).send(err.message)
                        })
                        connectionMySql.commit((err) => {
                            if(err) return connectionMySql.rollback(() => {
                                return res.status(500).send(err.message)
                            })
                            res.send({success: true})
                        })
                    })
                })
            }
        })
    },
    deleteRequest(req, res, next) {
        const memberIDRequest = req.body.memberID
        const roomID = req.inforMember.roomID
        connectionMySql.query(`delete from requestIntoRoom
        where requestIntoRoom.roomID = '${roomID}' and requestIntoRoom.memberID = '${memberIDRequest}'`, (err, result) => {
            if(err) {
                return res.status(500).send(err.message)
            }
            else {
                res.send({success: true})
            }
        })
    }
}