const connectionMySql = require("../Models/connectMySql")

module.exports = {
    getInforBasicRoom(req, res, next) {
        const {roomID, nameRoom, accountMoneyRemain} = req.inforMember
        res.send({roomID, nameRoom, accountMoneyRemain})
    },
    getAllRoomOfUser(req, res, next) {
        const {account, password} = req.body
        connectionMySql.query(`select room.roomID, room.nameRoom
        from member join host on member.memberID = host.memberID
            join room on room.roomID = host.roomID
        where member.account = '${account}'`, (err, result) => {
            if(err) return res.status(500).send(err.message)
            res.send({success: true, allRoom: result})
        })
    },
    postRequestIntoRoom(req, res, next) {
        const {memberID, memberIDToken} = req
        const {noteForHost, endcodeRoom} = req.body
        let query
        if(noteForHost) query = `insert into requestIntoRoom(memberID, roomID, note, confirm)
        values
        ('${memberID}', '${endcodeRoom}', '${noteForHost}', false)`
        else query = `insert into requestIntoRoom(memberID, roomID, note, confirm)
        values
        ('${memberID}', '${endcodeRoom}', NULL, false)`
        connectionMySql.query(query, (err, result) => {
            if(err) return res.status(500).send(err)
            res.send({success: true, memberIDToken})
        })
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