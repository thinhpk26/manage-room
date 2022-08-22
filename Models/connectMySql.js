const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'database-1.crifmqxzqxtk.ap-south-1.rds.amazonaws.com',
    user: 'admin',
    password: 'Thinh&thinhhj1',
    database: 'Manage_room_1',
    port: '3306'
})
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'account room',
//   port: '3306'
// })
connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack)
      return
    }
})
// connection.query(`select * from room`, function(err, result) {
//   if(err) console.error(err)
//   else console.log(result)
// })


module.exports = connection