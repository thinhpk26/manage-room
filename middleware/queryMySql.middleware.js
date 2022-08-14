module.exports = {
    postMiddleware(req, res, next) {
        const query = req.body.query
        req.query = query
        next()
    }
}