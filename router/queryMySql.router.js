const express = require('express')
const app = express.Router()
const {postMiddleware} = require('../middleware/queryMySql.middleware')
const {postTable, postInsertTable, postFunction, postProc, postTrigger, postView} = require('../controller/queryMySql.controller')

app.post('/table', postMiddleware, postTable)
app.post('/insert-table', postMiddleware, postInsertTable)
app.post('/function', postMiddleware, postFunction)
app.post('/procudure', postMiddleware, postProc)
app.post('/view', postMiddleware, postView)
app.post('/trigger', postMiddleware, postTrigger)

module.exports = app