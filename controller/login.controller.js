const connectionMySql = require('../Models/connectMySql')
const path = require('path')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

module.exports = {
    getLogin(req, res, next) {
        res.render(path.join(__dirname, '../views/pages/login.ejs'))
    },
    postLogin(req, res, next) {
        const memberIDToken = req.memberIDToken
        const memberID = req.memberID
        const {createRoom, endcodeRoom, noteMember} = req.body
        if(!createRoom && !endcodeRoom) {
            res.send({type: 1, success: true})
        } else if(createRoom && !endcodeRoom /* Khi người dùng muốn tạo phòng */) {
            const roomID = uuid.v4().split('-').join('').slice(0, 16)
            connectionMySql.query(`Insert Into room(roomID, nameRoom, accountMoneyRemain)
            values
            ('${roomID}', '${createRoom}', 0)`, (err, result) => {
                if(err) return connectionMySql.rollback(() => {
                    res.status(500).send(err.message)
                })
                else {
                    connectionMySql.query(`Insert Into host(memberID, roomID, host, remainMoney)
                    values
                    ('${memberID}', '${roomID}', true, 0)`, (err, result) => {
                        if(err) return connectionMySql.rollback(() => {
                            res.status(500).send(err.message)
                        })
                        connectionMySql.commit(err => {
                            if(err) return connectionMySql.rollback(() => {
                                res.status(500).send(err.message)
                            })
                            const roomIDToken = jwt.sign(roomID.toString(), process.env.JWTPASSWORD)
                            res.send({type: 2, success: true, memberIDToken, roomIDToken})
                        })
                    })
                }
            })
        } else if (!createRoom && endcodeRoom /* Khi người dùng muốn vào phòng */) {
            // Check xem có phòng này không
            connectionMySql.query(`select room.roomID
            from room
            where room.roomID = '${endcodeRoom}'`, (err, result) => {
                if(err) res.status(500).send(err.message)
                else {
                    if(result.length === 0) {
                        // có phòng hay không
                        res.send({type: 3, isRoom: false})
                    } else {
                        // check xem người dùng đã ở phòng này chưa
                        connectionMySql.query(`select host.roomID 
                        from host
                        where host.roomID = '${endcodeRoom}' and host.memberID = '${memberID}'`, (err, result) => {
                            if(err) res.status(500).send(err.message)
                            else {
                                if(result.length > 0) {
                                    const roomIDToken = jwt.sign(endcodeRoom.toString(), process.env.JWTPASSWORD)
                                    res.send({type: 3, isRoom: true, isMember: true, memberIDToken, roomIDToken})
                                } else {
                                    // Thêm xác nhận vào phòng cho chủ phòng
                                    let query
                                    if(noteMember) query = `insert into requestIntoRoom(memberID, roomID, note, confirm)
                                    values
                                    ('${memberID}', '${endcodeRoom}', '${noteMember}', false)`
                                    else query = `insert into requestIntoRoom(memberID, roomID, note, confirm)
                                    values
                                    ('${memberID}', '${endcodeRoom}', NULL, false)`
                                    connectionMySql.query(query, (err, result) => {
                                        if(err) {
                                            res.send({type: 3, hadRequest/* Check xem đã có yêu cầu vào chưa */: true, isRoom: true})
                                        }
                                        else {
                                            const roomIDToken = jwt.sign(endcodeRoom.toString(), process.env.JWTPASSWORD)
                                            res.send({type: 3, hadRequest/* Check xem đã có yêu cầu vào chưa */: false, isRoom: true, memberIDToken, roomIDToken})
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        } else if(createRoom && endcodeRoom /* Khi người dùng vừa tạo phòng vừa vào phòng */) {
            res.send({type: 4, message: 'Bạn không thể cùng lúc tạo phòng và vào phòng'})
        }
    },
}