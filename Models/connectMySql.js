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
module.exports = connection