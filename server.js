"use strict";
const express = require('express')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// server
const app = express()
const http = require('http')
const server = http.createServer(app)
const PORT = process.env.PORT || 3000
const path = require('path')

app.set('view engine', 'ejs')
// cookie
app.use(cookieParser())

// body
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Middleware err
const errorMiddleware = require('./middleware/error.middleware')

const queryMySql = require('./router/queryMySql.router')
const loginRouter = require('./router/login.router')
const homeRouter = require('./router/home.router')
const rechargeRouter = require('./router/recharge.router')
const memberRouter = require('./router/member.router');
const withdrawRouter = require('./router/withdraw.router');
const purchaseRouter = require('./router/purchase.router');
const roomRouter = require('./router/room.router');
const SignUpRouter = require('./router/signUp.router');
const manageRouter = require('./router/manage.router');

// Router
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/query', queryMySql)
app.use('/login', loginRouter)
app.use('/', homeRouter)
app.use('/member', memberRouter)
app.use('/recharge-money', rechargeRouter)
app.use('/withdraw-money', withdrawRouter)
app.use('/purchase', purchaseRouter)
app.use('/room', roomRouter)
app.use('/sign-up', SignUpRouter)
app.use('/manage', manageRouter)

app.use(errorMiddleware)

app.get('/error', (req, res, next) => {
    res.send('Reload page, Srr.....')
})

server.listen(PORT, () => {
    console.log('listened at http://localhost:' + PORT)
})
