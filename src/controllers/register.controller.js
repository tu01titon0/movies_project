const qs = require('qs')
const baseController = require('./base.controller')
const baseModel = require('../../src/models/base.model')
const userModel = require('../../src/models/user.model')

class RegisterController {

    async getRegisterPage(req, res) {
        if (req.method === 'GET') {
            let html = await baseController.getTemplate('./src/views/signup.html')
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
                let uniqueName = await userModel.findUserByName(name)
                if (uniqueName.length === 0) {
                    await userModel.createUser(name,email,password)
                    res.writeHead(301, {location: '/login'});
                } else {
                    let html = await baseController.getTemplate('./src/views/signup.html')
                    html = html.replace('id="result">', "id=\"result\">" + "UserName has been Existed!")
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