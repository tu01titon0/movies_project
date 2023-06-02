const qs = require('qs')
const BaseController = require('./base.controller')
const baseModel = require('../../src/models/base.model')
const userModel = require('../../src/models/user.model')

class RegisterController {

    async getRegisterPage(req, res) {
        if (req.method === 'GET') {
            let html = await BaseController.getTemplate('./src/views/signup.html')
            res.writeHead(200, {'Content-type': 'text/html'});
            res.write(html);
            res.end();
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', async () => {
                let infoUser = qs.parse(data)
                let {name, password, email} = infoUser
                let uniqueName = await userModel.findUserByEmail(email)
                if (uniqueName.length === 0) {
                    await userModel.createUser(name,email,password)
                    let html = await BaseController.getTemplate('./src/views/login.html')
                    html = html.replace('id="result">', "id=\"result\">" + "Register success Login to join with us!")
                    res.writeHead(301, {location: '/login'});
                    res.writeHead(200, {'Content-type': 'text/html'});
                    res.write(html)
                } else {
                    let html = await BaseController.getTemplate('./src/views/signup.html')
                    html = html.replace('id="result">', "id=\"result\">" + "Email has been Existed!")
                    res.writeHead(200, {'Content-type': 'text/html'});
                    res.write(html);
                }
                res.end()
            })
            req.on('error', () => {
                console.log('error')
            })

        }
    }
}
module.exports = new RegisterController()