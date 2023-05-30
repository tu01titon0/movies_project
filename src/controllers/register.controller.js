const qs = require('qs')
const baseController = require('./base.controller')
const baseModel = require('../../src/models/base.model')

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
                let{name,password,email}=infoUser
                const sqlUser=`select * from users where userName='${name}'`
                let uniqueName= await baseModel.querySql(sqlUser, (err, data) => {
                    if (err) throw err
                })
                if(uniqueName.length===0){
                    const sql = `CALL addUser('${name}','${password}','${email}')`
                    await baseModel.querySql(sql, (err, data) => {
                        if (err) throw err
                    })
                    res.writeHead(301, {location: '/login'});
                }else{
                    console.log(123)
                    let html = await baseController.getTemplate('./src/views/signup.html')
                    html=html.replace('id="result">',"id=\"result\">"+"UserName has been Existed!")
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