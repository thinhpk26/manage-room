const connectionMySql = require('../Models/connectMySql')
require('dotenv').config()
const jwt = require('jsonwebtoken')
module.exports = {
    postMiddleware(req, res, next) {
        const inforLogin = req.body
        let query = `call pr_login('${inforLogin.account}','${inforLogin.password}')`
        query = query.replace(/(\r\n|\n|\r)/gm, "")
        connectionMySql.query(query, (err, result, field) => {
            if(err) {
                res.status(400).send(err)
            }
            if(result[0].length > 0) {
                const memberID = result[0][0].memberID
                const memberIDToken = jwt.sign(memberID.toString(), process.env.JWTPASSWORD)
                req.memberIDToken = memberIDToken
                next()
            }
            else 
                res.send({success: false, message: 'Account or password not correct'})
        })
    }
}