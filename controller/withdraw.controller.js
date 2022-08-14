const path = require('path')
const connectionMySql = require('../Models/connectMySql')
module.exports = {
    get(req, res, next) {
        res.send('oke')
    },
    postToGetHistoryWithdraw(req, res, next) {
        let memberID = req.memberID
        let {offset, memberIDHistory} = req.body, limit = offset + 10
        // Trường hợp không có ID người dùng hiện tại
        if(!memberIDHistory) memberIDHistory = memberID
        const query = `call pr_getHistoryWithdraw('${memberIDHistory}', ${offset}, ${limit})`
        connectionMySql.query(query, (err, result, field) => {
            if(err) res.status(500).send(err.message)
            else {
                const inforResponse = result[0].reduce((pre, cur) => {
                        pre.push({withdrawID: cur.withdrawID, withdrawMoney: cur.withdrawMoney, withdrawDay: cur.withdrawDay})
                        return pre
                    }, [])
                if(result[0].length < 10) {
                    res.send({exhaustedWithdraw: true, inforResponse})
                } else {
                    res.send({exhaustedWithdraw: false, inforResponse})
                }
            }
        })
    },
    postGetFilterWithdraw(req, res, next) {
        let memberID = req.memberID
        let {offset, memberIDHistory, beginDay, endDay} = req.body, limit = offset + 10
        // Trường hợp không có ID người dùng hiện tại
        if(!memberIDHistory) memberIDHistory = memberID
        if(Date.parse(beginDay) > Date.parse(endDay)) {
            res.send({success:false, message: 'Ngày bạn nhập không chính xác hoặc không theo thứ tự thời gian'})
        } else {
            const query = `call pr_filter_history_withdraw('${memberIDHistory}', '${beginDay}', '${endDay}', ${offset}, ${limit})`
            connectionMySql.query(query, (err, result, field) => {
                if(err) res.status(500).send(err.message)
                else {
                    const inforResponse = result[0].reduce((pre, cur) => {
                        pre.push({withdrawID: cur.withdrawID, withdrawMoney: cur.withdrawMoney, withdrawDay: cur.withdrawDay})
                            return pre
                        }, [])
                    if(result[0].length < 10) {
                        res.send({exhaustedWithdraw: true, inforResponse})
                    } else {
                        res.send({exhaustedWithdraw: false, inforResponse})
                    }
                }
            })
        }
    },
    postToAddWithdraw(req, res, next) {
        const memberID = req.memberID
        const withdrawMoney = req.body.accountMoneyWithdraw
        if(typeof withdrawMoney === 'number' && !isNaN(withdrawMoney)) {
            const query = `INSERT INTO withdrawMoney(withdrawMoney, withdrawDay, memberID)
            VALUES
            (${withdrawMoney}, now(), '${memberID}')`
            connectionMySql.query(query, (err, result, field) => {
                if(err) res.status(500).send(err)
                else {
                    if(result.affectedRows >= 1) res.send({success: true})
                    else res.send({success: false, message: 'Không thể nạp tiền bây giờ!sr...'})
                }
            })
        } else res.send({success: false, message: 'Dữ liệu đã bị lỗi, hãy reset lại page!'})
    },
    putWithdraw(req, res, next) {

    },
    deleteWithdraw(req, res, next) {
        const memberID = req.memberID
        const {withdrawID} = req.body
        connectionMySql.query(`select * from withdrawMoney where withdrawID = ${withdrawID} and memberID = '${memberID}'`, (err, result) => {
            if(err) res.status(500).send(err)
            else {
                if(result.length > 0) {
                    const query = `delete from withdrawMoney where withdrawID = ${withdrawID}`
                    connectionMySql.query(query, (err, result) => {
                        if(err) res.status(500).send(err)
                        else {
                            res.send({success: true})
                        }
                    })
                } else res.status(400).send({success: false, message: 'Chỉ có người tạo mới có thể xóa số tiền nạp'})
            }
        })
    },
}