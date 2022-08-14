const connectionMySql = require('../Models/connectMySql')
const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
    const memberIDToken = req.cookies.memberIDToken
    const memberID = jwt.verify(memberIDToken, process.env.JWTPASSWORD, (err, decode) => {
        if(err) return undefined
        return decode
    })
    const query = `call pr_auth('${memberID}')`
    connectionMySql.query(query, (err, result, field) => {
        if(err) res.status(500).send(err)
        else
            if(!result[0][0].success) {
                res.status(404).send('Account not found')
            } else {
                req.memberID = memberID
                req.inforMember = {
                    name: result[0][0].name,
                    remainMoney: result[0][0].remainMoney,
                    account: result[0][0].account,
                    password: result[0][0].password,
                    imgMember: result[0][0].imgMember,
                    roomID: result[0][0].roomID,
                    nameRoom: result[0][0].nameRoom,
                    accountMoneyRemain: result[0][0].accountMoneyRemain,
                }
                next()
            }
    })
}