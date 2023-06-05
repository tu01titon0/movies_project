const qs = require('qs');
const BaseController = require("./base.controller");
const cookie = require('cookie');
class LogoutController {
    async logout(req, res) {
        let id = req.user.id
        await BaseController.deleteFileData('./session/user-' + id)
        req.user=undefined
        res.writeHead(301, {Location: '/login'});
        return res.end()
    }
}

module.exports = new LogoutController