const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'database-1.crifmqxzqxtk.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Thinh&thinhhj1',
    database: 'Manage_room_1',
    port: '3306'
})
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack)
      return
    }
})
// connection.query(`create PROCEDURE pr_purchase_history(offset_cli int, limit_cli int, roomID_cli char(16))
// BEGIN
//     SELECT
//     member.memberID, member.name nameMemberUse, memberUse.orderID, mem1.memberID memberPaidID, mem1.name memberPaid, memberUse.moneyPay moneyMemberPay, ordereachday1.sumMoney, ordereachday1.purchaseDate, ordereachday1.note, purchaseItem.itemID, purchaseItem.nameItem, purchaseItem.moneyPaid moneyPaidForItem
//     from memberUse
//     inner join (SELECT * FROM orderEachDay ORDER BY orderEachDay.purchaseDate DESC LIMIT limit_cli OFFSET offset_cli) ordereachday1 on memberUse.orderID = ordereachday1.orderID
//     inner join member mem1 on mem1.memberID = ordereachday1.memberPaid 
//     right join member on member.memberID = memberUse.memberID
//     LEFT JOIN purchaseItem on purchaseItem.orderID = ordereachday1.orderID
//     where ordereachday1.roomID = roomID_cli;
// END`, (err, result) => {
//   console.log(result)
// })

module.exports = connection