const qs = require('qs');
const BaseController = require("./base.controller");
const cookie = require('cookie');
class LogoutController {
    async logout(req, res) {
        let id = req.user.id
        await BaseController.deleteFileData('./session/user-' + id)
        res.setHeader('Cache-Control','no-cache, no-store, must-revalidate')
        res.writeHead(301, {Location: '/login'});
        return res.end()
    }
}
module.exports = new LogoutController