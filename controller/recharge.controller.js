const path = require('path')
const connectionMySql = require('../Models/connectMySql')
module.exports = {
    getRecharge(req, res, next) {
        res.render(path.join(__dirname, '../views/pages/recharge.ejs'))
    },
    postToGetHistoryRecharge(req, res, next) {
        let memberID = req.memberID
        let {offset, memberIDHistory} = req.body, limit = offset + 10
        // Trường hợp không có ID người dùng hiện tại
        if(!memberIDHistory) memberIDHistory = memberID
        const query = `call pr_getHistoryRecharge('${memberIDHistory}', ${offset}, ${limit})`
        connectionMySql.query(query, (err, result, field) => {
            if(err) res.status(500).send(err.message)
            else {
                const inforResponse = result[0].reduce((pre, cur) => {
                        pre.push({rechargeID: cur.rechargeID, accountMoneyRecharge: cur.rechargeMoney, rechargeDay: cur.rechargeDay})
                        return pre
                    }, [])
                if(result[0].length < 10) {
                    res.send({exhaustedRecharge: true, inforResponse})
                } else {
                    res.send({exhaustedRecharge: false, inforResponse})
                }
            }
        })
    },
    postGetFilterRecharge(req, res, next) {
        let memberID = req.memberID
        let {offset, memberIDHistory, beginDay, endDay} = req.body, limit = offset + 10
        // Trường hợp không có ID người dùng hiện tại
        if(!memberIDHistory) memberIDHistory = memberID
        if(Date.parse(beginDay) > Date.parse(endDay)) {
            res.send({success:false, message: 'Ngày bạn nhập không chính xác hoặc không theo thứ tự thời gian'})
        } else {
            const query = `call pr_filter_history_recharge('${memberIDHistory}', '${beginDay}', '${endDay}', ${offset}, ${limit})`
            connectionMySql.query(query, (err, result, field) => {
                if(err) res.status(500).send(err.message)
                else {
                    const inforResponse = result[0].reduce((pre, cur) => {
                            pre.push({rechargeID: cur.rechargeID, accountMoneyRecharge: cur.rechargeMoney, rechargeDay: cur.rechargeDay})
                            return pre
                        }, [])
                    if(result[0].length < 10) {
                        res.send({exhaustedRecharge: true, inforResponse})
                    } else {
                        res.send({exhaustedRecharge: false, inforResponse})
                    }
                }
            })
        }
    },
    postToRecharge(req, res, next) {
        const memberID = req.memberID
        const accountMoney = req.body.accountMoney
        console.log(accountMoney, memberID)
        if(typeof accountMoney === 'number' && !isNaN(accountMoney)) {
            const query = `INSERT INTO rechargeMoney(accountMoney, rechargeDay, memberID)
            VALUES
            (${accountMoney}, now(), '${memberID}')`
            connectionMySql.query(query, (err, result, field) => {
                console.log(err, result)
                if(err) res.status(500).send(err)
                else {
                    if(result.affectedRows >= 1) res.send({success: true})
                    else res.send({success: false, message: 'Không thể nạp tiền bây giờ!sr...'})
                }
            })
        } else res.send({success: false, message: 'Dữ liệu đã bị lỗi, hãy reset lại page!'})
    },
    putRecharge(req, res, next) {
        const memberID = req.memberID
        const {accountMoney, rechargeMoneyID} = req.body
        connectionMySql.query(`select * from rechargeMoney where rechargeMoney = '${rechargeMoneyID}' and memberID = '${memberID}'`, (err, result) => {
            if(err) res.status(500).send(err)
            else {
                if(result.length > 0) {
                    const query = `update rechargeMoney set accountMoney = ${accountMoney} where rechargeMoney = '${rechargeMoney}'`
                    connectionMySql.query(query, (err, result) => {
                        if(err) res.status(500).send(err)
                        else {
                            if(result.affectedRows >= 1) res.send({success: true})
                            else res.send({success: false})
                        }
                    })
                } else res.status(400).send({success: false, message: 'Chỉ có người tạo mới có thể thay đổi số tiền nạp'})
            }
        })
    },
    deleteRecharge(req, res, next) {
        const memberID = req.memberID
        const {rechargeID} = req.body
        connectionMySql.query(`select * from rechargeMoney where rechargeMoney = ${rechargeID} and memberID = '${memberID}'`, (err, result) => {
            if(err) res.status(500).send(err)
            else {
                if(result.length > 0) {
                    const query = `delete from rechargeMoney where rechargeMoney = ${rechargeID}`
                    connectionMySql.query(query, (err, result) => {
                        if(err) res.status(500).send(err)
                        else {
                            if(result.affectedRows >= 1) res.send({success: true})
                            else res.send({success: false})
                        }
                    })
                } else res.status(400).send({success: false, message: 'Chỉ có người tạo mới có thể xóa số tiền nạp'})
            }
        })
    },
}