const qs = require('qs')
const baseController = require('./base.controller')
const baseModel=require('../../src/models/base.model')

class RegisterController {

    async getRegisterPage(req, res) {
        if (req.method ==='GET') {
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
                let name = qs.parse(data).name
                let password = qs.parse(data).password
                let email = qs.parse(data).email
                const sql = `CALL addUser('${name}','${password}','${email}')`
                await baseModel.querySql(sql,(err,data)=>{
                     if(err) throw err
                })
                res.writeHead(301, {location:'/login'});
                res.end()
            })
            req.on('error', () => {
                console.log('error')
            })

        }
    }
}

module.exports = new RegisterController()