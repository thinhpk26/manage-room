const path = require('path')
const connectionMySql = require('../Models/connectMySql')
module.exports = {
    gethome(req, res, next) {
        const memberID = req.memberID
        res.render(path.join(__dirname, '../views/pages/home.ejs'), {name: req.inforMember.name, imgMember: req.inforMember.imgMember})
    },
    getInforOfMember(req, res, next) {
        const memberID = req.memberID
        const offset = 0, limit = 10
        const query = `call pr_infor_member('${memberID}', ${offset}, ${limit})`
        connectionMySql.query(query, (err, result, field) => {
            if(err) res.status(500).send(err.message)
            else {
                const inforResponse = {
                    name: result[0][0].name,
                    remainMoney: result[0][0].remainMoney,
                    historyRecharge: result[0].reduce((pre, cur) => {
                        pre.push({accountMoneyRecharge: cur.accountMoney_recharge, rechargeDay: cur.rechargeDay})
                        return pre
                    }, [])
                }
                res.send(inforResponse)
            }
        })
    },
    getTenthPurchaseHistory(req, res, next) {
        const offset = 0, limit = 10
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
                        let isHaveMember = false
                        for(let i of inforResponse[index].memberPaid) {
                            if(i.memberID === ele.memberPaidID) {
                                isHaveMember = true
                                break
                            }
                        }
                        if(!isHaveMember) inforResponse[index].memberPaid.push({memberID: ele.memberPaidID, name: ele.memberPaid})
                        let isHaveItemPurchase = false
                        for(let i of inforResponse[index].itemPurchase) {
                            if(i.itemID === ele.itemID) {
                                isHaveItemPurchase = true
                                break
                            }
                        }
                        if(!isHaveItemPurchase) inforResponse[index].itemPurchase.push({itemID: ele.itemID, nameItem: ele.nameItem, moneyPay: ele.moneyPaidForItem})
                    } else {
                        inforResponse.push({
                            memberPurchaseID: ele.memberID,
                            nameMemberUse: ele.nameMemberUse,
                            orderID: ele.orderID,
                            memberPaid: [{memberID: ele.memberPaidID, name: ele.memberPaid}],
                            moneyEachMemberPay: ele.moneyMemberPay,
                            sumMoney: ele.sumMoney,
                            purchaseDate: ele.purchaseDate,
                            itemPurchase: [{itemID: ele.itemID, nameItem: ele.nameItem, moneyPay: ele.moneyPaidForItem}],
                            note: ele.note
                        })
                    }
                })
                res.send(inforResponse)
            }
        })
    }
}