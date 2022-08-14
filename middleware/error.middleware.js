module.exports = (error, req, res, next) => {
    if (error.type === 'redirect')
        res.redirect('/error')
    else if (error.type === 'time-out') // arbitrary condition check
        res.status(408).send(error)
    else if (error.type === 'login again')
        res.status(408).send('login again')
    else if (error.type === 'regis')
        res.status(408).send('Exist account')
    else if(error.type === 'err data')
        res.status(407).send('error data')
    else
        res.status(500).send(error.message)
}