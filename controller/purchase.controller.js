const uuid = require('uuid')
const connectionMySql = require('../Models/connectMySql')
const path = require('path')
module.exports = {
    getPurchase(req, res, next) {
        res.render(path.join(__dirname, '../views/pages/purchase.ejs'))
    },
    postToGetHistoryPurchase(req, res, next) {
        const {offset, limit} = req.body
        const query = `call pr_purchase_history(${offset}, ${limit})`
        connectionMySql.query(query, (err, result, field) => {
            if(err) res.status(500).send(err.message)
            else {
                const inforResponse = []
                result[0].forEach(ele => {
                    let isHave = false
                    let index
                    for(let i=0; i<inforResponse.length; i++) {
                        if(inforResponse[i].orderID === ele.orderID) {
                            index = i
                            isHave = true
                            break
                        }
                    }
                    if(isHave) {
                        // Lọc các member - member có rồi thì bị loại bỏ
                        let isHaveMember = false
                        if(inforResponse[index].memberPaid.length > 0) {
                            for(let i of inforResponse[index].memberPaid) {
                                if(i.memberID === ele.memberID) {
                                    isHaveMember = true
                                    break
                                }
                            }
                        } else isHaveMember = true
                        if(!isHaveMember) inforResponse[index].memberPaid.push({memberID: ele.memberID, name: ele.nameMemberUse})
                        // Lọc các vật phẩm - vật phẩm có rồi thì bị loại bỏ
                        let isHaveItemPurchase = false
                        if(inforResponse[index].itemPurchase.length > 0) {
                            for(let i of inforResponse[index].itemPurchase) {
                                if(i.itemID === ele.itemID) {
                                    isHaveItemPurchase = true
                                    break
                                }
                            }
                        } else isHaveItemPurchase = true
                        if(!isHaveItemPurchase) inforResponse[index].itemPurchase.push({itemID: ele.itemID, nameItem: ele.nameItem, moneyPay: ele.moneyPaidForItem})
                        } else {
                        let itemPurchase = []
                        if(ele.itemID) {
                            itemPurchase = [{itemID: ele.itemID, nameItem: ele.nameItem, moneyPay: ele.moneyPaidForItem}]
                        }
                        if(ele.orderID)
                            inforResponse.push({
                                memberPurchaseID: ele.memberPaidID,
                                nameMemberUse: ele.memberPaid,
                                orderID: ele.orderID,
                                memberPaid: [{memberID: ele.memberID, name: ele.nameMemberUse}],
                                moneyEachMemberPay: ele.moneyMemberPay,
                                sumMoney: ele.sumMoney,
                                purchaseDate: ele.purchaseDate,
                                itemPurchase,
                                note: ele.note
                            })
                    }
                })
                res.send(inforResponse)
            }
        })
    },
    postPurchase(req, res, next) {
        const memberID = req.memberID
        let {sumMoney, memberPaid, purchaseItem, memberUse, note} = req.body
        const orderID = uuid.v4().replace(/\-/g, '').slice(0, 16)
        let noteUpServer
        if(!note || note !== '') noteUpServer = `'${note}'`
        else noteUpServer = null
        if(typeof sumMoney === 'string') sumMoney = parseFloat(sumMoney)
        const insertOrderEachDay = `Insert into orderEachDay
        values
        ('${orderID}', ${sumMoney}, '${memberPaid}', now(), '${memberID}', ${noteUpServer})`
        connectionMySql.beginTransaction((err) => {
            if(err) return res.status(500).send(err.message)
            else {
                connectionMySql.query(insertOrderEachDay, (err, result) => {
                    if(err) return connectionMySql.rollback(() => {
                            res.status(400).send(err.message)
                        })
                    for(let i=0; i<memberUse.length; i++) {
                        const insertMemberUse = `INSERT INTO memberUse(memberID, orderID, moneypay)
                        VALUES
                        ('${memberUse[i]}', '${orderID}', ${sumMoney / memberUse.length})`
                        connectionMySql.query(insertMemberUse, (err, result) => {
                            if(err) return connectionMySql.rollback(() => {
                                    res.status(400).send(err.message)
                                })
                        })
                    }
                    if(purchaseItem) {
                        for(let i=0; i<purchaseItem.length; i++) {
                            const insertPurchase = `INSERT INTO purchaseItem(nameItem, moneyPaid, orderID)
                            VALUES
                            ('${purchaseItem[i].nameItem}', ${purchaseItem[i].moneyPay}, '${orderID}');`
                            connectionMySql.query(insertPurchase, (err, result) => {
                                if(err) return connectionMySql.rollback(() => {
                                        res.status(400).send(err.message)
                                    })
                            })
                        }
                    }
                    connectionMySql.query(`insert into notify(content, date_notify, orderID) values ('1 hóa đơn mới vừa được thêm bởi ${req.inforMember.name}', now(), '${orderID}')`, (err, result) => {
                        if(err) return connectionMySql.rollback(() => {
                            res.status(400).send(err.message)
                        })
                        connectionMySql.commit((err) => {
                            if(err) return connectionMySql.rollback(() => {
                                res.status(400).send(err.message)
                            })
                            res.send({success: true})
                        })
                    })
                })
            }
        })
    },
    putPurchase(req, res, next) {
        const memberID = req.memberID
        let {orderID, sumMoney, memberPaid, purchaseItem, memberUse, note} = req.body
        let noteUpServer
        if(!note || note !== '') noteUpServer = `'${note}'`
        else noteUpServer = null
        if(typeof sumMoney === 'string') sumMoney = parseFloat(sumMoney)
        console.log(orderID, sumMoney, memberPaid, purchaseItem, memberUse, note)
        const queryCheckAuth = `select * from orderEachDay where orderEachDay.memberAdd = '${memberID}' and orderEachDay.orderID = '${orderID}'`
        connectionMySql.query(queryCheckAuth, (err, result) => {
            if(err) res.status(500).send(err)
            else {
                if(result.length > 0) {
                    connectionMySql.beginTransaction((err) => {
                        if(err) return res.status(500).send(err.message)
                        else {
                            console.log(1)
                            const updateOrderEachDay = `Update orderEachDay
                            set
                            orderEachDay.sumMoney = ${sumMoney},
                            orderEachDay.memberPaid = '${memberPaid}',
                            orderEachDay.note = ${noteUpServer}
                            where orderEachDay.orderID = '${orderID}'
                            `
                            connectionMySql.query(updateOrderEachDay, (err, result) => {
                                if(err) return connectionMySql.rollback(() => {
                                        console.log(2)
                                        res.status(400).send(err.message)
                                    })
                                // Sửa lại các thành viên đã sử dụng
                                for(let i=0; i<memberUse.length; i++) {
                                    const updateMemberUse = `call pr_update_purchase_memberuse('${memberUse[i]}', '${orderID}', ${sumMoney / memberUse.length});`
                                    connectionMySql.query(updateMemberUse, (err, result) => {
                                        if(err) return connectionMySql.rollback(() => {
                                            console.log(3)
                                                res.status(400).send(err.message)
                                            })
                                    })
                                }
                                // Nếu sửa thừa thành viên thì xóa thành viên ra khỏi bảng memberuse
                                let updateMemberUse
                                if(memberUse.length > 0) {
                                    updateMemberUse = `Delete from memberUse \n` + memberUse.reduce((pre, cur) => {
                                        return pre + ` memberUse.memberID <> '${cur}' and`
                                    }, 'where') + ` memberUse.orderID = '${orderID}'`
                                } else {
                                    updateMemberUse = `Delete from memberUse \n` + `where memberUse.orderID = '${orderID}'`
                                }
                                connectionMySql.query(updateMemberUse, (err, result) => {
                                    if(err) return connectionMySql.rollback(() => {
                                        console.log(4)
                                        res.status(400).send(err.message)
                                    })
                                })
                                if(purchaseItem) {
                                    // Sửa lại bảng purchaseItem
                                    let countCreatedItems = 0
                                    for(let i=0; i<purchaseItem.length; i++) {
                                        let updatePurchase
                                        if(!purchaseItem[i].itemID) {
                                            updatePurchase = `INSERT purchaseItem(nameItem, moneyPaid, orderID)
                                            VALUES
                                            ('${purchaseItem[i].nameItem}', ${purchaseItem[i].moneyPay}, '${orderID}');`
                                            countCreatedItems++
                                        }
                                        else {
                                            updatePurchase = `UPDATE purchaseItem
                                            set
                                            purchaseItem.nameItem = '${purchaseItem[i].nameItem}',
                                            purchaseItem.moneyPaid = ${purchaseItem[i].moneyPay}
                                            where purchaseItem.itemID = '${purchaseItem[i].itemID}';`
                                        }
                                        // lưu trữ id của những vật phẩm vừa tạo
                                        connectionMySql.query(updatePurchase, (err, result) => {
                                            if(err) return connectionMySql.rollback(() => {
                                                console.log(5)
                                                    res.status(400).send(err.message)
                                                })
                                        })
                                    }
                                    connectionMySql.query(`select purchaseItem.itemID from purchaseItem order by purchaseItem.itemID desc limit ${countCreatedItems}`, (err, result) => {
                                        if(err) return connectionMySql.rollback(() => {
                                            console.log(6)
                                            res.status(400).send(err.message)
                                        })
                                        // Nếu thừa item sẽ xóa item trong bảng
                                        let updatePurchase
                                        if(purchaseItem.length > 0) {
                                            updatePurchase = `Delete from purchaseItem \n` + purchaseItem.reduce((pre, cur) => {
                                                if(cur.itemID) return pre + ` purchaseItem.itemID <> '${cur.itemID}' and`
                                                else return pre + ''
                                            }, 'where') + ` purchaseItem.orderID = '${orderID}' and` + result.reduce((pre, cur) => {
                                                return pre + ` purchaseItem.itemID <> '${cur.itemID}' and`
                                            }, '')
                                            updatePurchase = updatePurchase.slice(0, updatePurchase.length - 3)
                                        } else {
                                            updatePurchase = `Delete from purchaseItem \n` + `where purchaseItem.orderID = '${orderID}'`
                                        }
                                        console.log(updatePurchase)
                                        connectionMySql.query(updatePurchase, (err, result) => {
                                            if(err) return connectionMySql.rollback(() => {
                                                console.log(7)
                                                res.status(400).send(err.message)
                                            })
                                        })
                                    })
                                }
                                connectionMySql.query(`insert into notify(content, date_notify, orderID) values ('Một hóa đơn vừa được update bởi ${req.inforMember.name}', now(), '${orderID}')`, (err, result) => {
                                    if(err) return connectionMySql.rollback(() => {
                                        console.log(8)
                                        res.status(400).send(err.message)
                                    })
                                    connectionMySql.commit((err) => {
                                        if(err) return connectionMySql.rollback(() => {
                                            res.status(400).send(err.message)
                                        })
                                        res.send({success: true})
                                    })
                                })
                            })
                        }
                    })
                } else {
                    res.send({success: false, message: 'Chỉ có người thêm mới có quyền sửa'})
                }
            }
        })
    },
    deletePurchase(req, res, next) {
        const memberID = req.memberID
        const {orderID} = req.body
        connectionMySql.query(`select * from orderEachDay where orderID = '${orderID}' and memberAdd = '${memberID}'`, (err, result) => {
            if(err) res.status(500).send(err)
            if(result.length > 0)
                connectionMySql.beginTransaction((err) => {
                    if(err) return res.status(400).send(err)
                    else {
                        connectionMySql.query(`delete from purchaseItem where purchaseItem.orderID = '${orderID}'`, (err, result) => {
                            if(err) return connectionMySql.rollback(() => {
                                res.status(400).send(err.message)
                            })
                            connectionMySql.query(`delete from memberUse where memberUse.orderID = '${orderID}'`, (err, result) => {
                                if(err) return connectionMySql.rollback(() => {
                                    res.status(400).send(err.message)
                                })
                                connectionMySql.query(`delete from orderEachDay where orderEachDay.orderID = '${orderID}'`,(err, result) => {
                                    if(err) return connectionMySql.rollback(() => {
                                        res.status(400).send(err.message)
                                    })
                                    connectionMySql.commit((err) => {
                                        if(err) return connectionMySql.rollback(() => {
                                            res.status(400).send(err.message)
                                        })
                                        res.send({success: true})
                                    })
                                })
                            })
                        })
                    }
                })
            else res.send({success: false, message: 'Chỉ có người tạo mới có quyền xóa'})
        })
    }
}