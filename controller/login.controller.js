const connectionMySql = require('../Models/connectMySql')
const path = require('path')
module.exports = {
    getLogin(req, res, next) {
        res.render(path.join(__dirname, '../views/pages/login.ejs'))
    },
    postLogin(req, res, next) {
        const memberIDToken = req.memberIDToken
        res.send({success: true, memberIDToken})
    }
}