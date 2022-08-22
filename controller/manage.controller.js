const path = require('path');
const connectionMySql = require('../Models/connectMySql')
module.exports = {
    getManage(req, res, next) {
        if(req.allow) {
            res.render(path.join(__dirname, '../views/pages/manage.ejs'))
        } else res.send('Bạn phải là chủ phòng để quản lý hoạt động!')
    },
    checkHost(req, res, next) {
        const memberID = req.memberID
        const roomID = req.inforMember.roomID
        connectionMySql.query(`select host.host
        from host join member on host.memberID = member.memberID
        where member.memberID = '${memberID}' and host.roomID = '${roomID}'`, (err, result) => {
            if(err) return res.status(500).send(err.message)
            else {
                req.allow = result[0].host
                next()
            }
        })
    }
}