const qs = require('qs')
const baseController = require('./base.controller')
class LoginController {
   async getLoginPage(req,res){
       let html = await baseController.getTemplate('./src/views/login.html')
       res.writeHead(200, {'Content-type': 'text/html'});
       res.write(html);
       res.end();
    }
}

module.exports = new LoginController()
