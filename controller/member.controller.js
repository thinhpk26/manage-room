const connectionMySql = require('../Models/connectMySql')

module.exports = {
    getBasicInfor(req, res, next) {
        const {name, imgMember, remainMoney} = req.inforMember
        res.send({name, imgMember, remainMoney, memberID: req.memberID})
    },
    postGetAccount(req, res, next) {
        const {memberIDOther} = req.body
        connectionMySql.query(`select remainMoney from member where memberID = '${memberIDOther}'`, (err, result) => {
            if(err) res.status(500).send(500)
            else res.send(result[0])
        })
    },
    getAllMember(req, res, next) {
        const memberID = req.memberID
        connectionMySql.query('select memberID, name, remainMoney, imgMember, roomID from member', (err, result) => {
            if(err) res.status(500).send(err)
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
    }
}