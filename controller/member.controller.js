const connectionMySql = require('../Models/connectMySql')
const uuid = require('uuid')

module.exports = {
    getBasicInfor(req, res, next) {
        const {name, imgMember, remainMoney, roomID, nameRoom} = req.inforMember
        res.send({name, imgMember, remainMoney, memberID: req.memberID, roomID, nameRoom})
    },
    postGetAccount(req, res, next) {
        const {memberIDOther} = req.body
        const roomID = req.inforMember.roomID
        connectionMySql.query(`select host.remainMoney 
        from member join host on host.memberID = member.memberID
        where member.memberID = '${memberIDOther}' and host.roomID ='${roomID}'`, (err, result) => {
            if(err) res.status(500).send(err)
            else res.send(result[0])
        })
    },
    getAllMember(req, res, next) {
        const memberID = req.memberID
        const roomID = req.inforMember.roomID
        connectionMySql.query(`select member.memberID, name, remainMoney, imgMember
        from member join host on member.memberID = host.memberID
        where host.roomID = '${roomID}'`, (err, result) => {
            if(err) {
                res.status(500).send(err)
            }
            else {
                // Sắp xếp thành viên
                for(let i=0; i<result.length; i++) {
                    if(result[i].memberID === memberID) {
                        const elementNeed = result.splice(i, 1)[0]
                        result.unshift(elementNeed)
                    }
                }
                res.send(result)
            }
        })
    },
    postCreateUser(req, res, next) {
        const {account, password, name} = req.body
        const memberID = uuid.v4().split('-').join('').slice(0, 8)
        connectionMySql.query(`call pr_signup('${memberID}', '${account}', ${password}, '${name}')`, function(err, result) {
            if(err) {
                return res.send(err)
            }
            if(result[0][0].success) {
                res.send({success: true})
            } else {
                res.send({success: false})
            }
        })
    }
}