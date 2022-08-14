const connectMySql = require('../Models/connectMySql')
module.exports = {
    postTable(req, res, next) {
        const query = req.query
        connectMySql.query(query, (err, result, field) => {
            if(err) throw err
            res.send('Affect to table success!')
        })
    },
    postInsertTable(req, res, next) {
        const query = req.query
        connectMySql.query(query, (err, result, field) => {
            if(err) res.status(400).send(err.message)
            else
                res.send('Insert table success!')
        })
    },
    postProc(req, res, next) {
        const query = req.query
        connectMySql.query(query, (err, result, field) => {
            if(err) res.status(400).send(err.message)
            else
                res.send('Affect to procudure success!')
        })
    },
    postView(req, res, next) {
        const query = req.query
        connectMySql.query(query, (err, result, field) => {
            if(err) res.status(400).send(err.message)
            else
                res.send('Affect to view success!')
        })
    },
    postTrigger(req, res, next) {
        const query = req.query
        connectMySql.query(query, (err, result, field) => {
            if(err) res.status(400).send(err.message)
            else
                res.send('Affect to trigger success!')
        })
    },
    postFunction(req, res, next) {
        const query = req.query
        connectMySql.query(query, (err, result, field) => {
            if(err) res.status(400).send(err.message)
            else 
                res.send('Create function success!')
        })
    }
}