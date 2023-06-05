const qs = require('qs');
const cookie = require('cookie');
const userModel = require('../../src/models/user.model');
const fs = require('fs');
const { ROLE_ADMIN, ROLE_USER } = require("./RolerConst");
const BaseController = require("./base.controller");
const logoutController =require('./logout.controller')

class LoginController {
    async login(req, res) {
        if (req.method === 'GET') {
            if (req.user) {
                let currentUserId = req.user.id;
                let rollUser = await userModel.findRoleUser(currentUserId);
                let role = JSON.parse(Buffer.from(JSON.stringify(rollUser[0]))).role.data[0];
                if (role === ROLE_USER) {
                    res.writeHead(301, { Location: '/home' });
                    return res.end();
                } else if (role === ROLE_ADMIN) {
                    res.writeHead(301, { Location: '/list_movies' });
                    return res.end();
                }
            }
        
            let html = await BaseController.getTemplate('./src/views/login.html');
            res.writeHead(200, { 'Content-type': 'text/html' });
            res.write(html);
            return res.end();
        } else {
            const buffer = [];
            for await (const chunk of req) {
                buffer.push(chunk);
            }
            const data = Buffer.concat(buffer).toString();
            const user = qs.parse(data);
            let { email, password } = user;
            let result = await userModel.findInfoToLogin(email, password);
            if (result.length > 0) {
                let nameFile = 'user-' + result[0].id;
                let dataSession = {
                    id: result[0].id,
                    name: result[0].username,
                    email: result[0].email
                };
                await BaseController.writeDataToFile('./session/' + nameFile, JSON.stringify(dataSession));
                let cookieLogin = {
                    id: result[0].id,
                    session: nameFile
                };
                res.setHeader('Set-Cookie', 'cookie-app=' + JSON.stringify(cookieLogin));
                if (req.user && result[0].role === ROLE_ADMIN) {
                    res.writeHead(301, { Location: '/list_movies' });
                } else {
                    res.writeHead(301, { Location: '/home' });
                }
                return res.end();
            } else {
                let html = await BaseController.getTemplate('./src/views/login.html');
                html = html.replace('id="retry">', 'id="retry">' + 'Email or password is not right');
                res.writeHead(200, { 'Content-type': 'text/html' });
                res.write(html);
                return res.end();
            }
        }
    }
}

module.exports = new LoginController()
