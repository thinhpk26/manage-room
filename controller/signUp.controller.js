const path = require('path');
module.exports = {
    getSignUp(req, res, next) {
        res.render(path.join(__dirname, '../views/pages/signUp.ejs'))
    },
}