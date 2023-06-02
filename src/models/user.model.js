const BaseModel = require("./base.model");
const baseModel = require("./base.model");
class UserModel extends BaseModel {
    async findUserByEmail(email) {
        const sql=`select * from Users where email='${email}'`
        return await this.querySql(sql)
    }
    async findInfoToLogin(email,password){
        const sql=`select * from Users where email='${email}' and passWord='${password}' `
        return await this.querySql(sql)
    }

    async createUser(name,email,password) {
        const sql = `CALL addUser('${name}','${password}','${email}')`
        return await  this.querySql(sql)
    }
    async findRoleUser(id) {
        const sql=`select role from users where id = ${id}`
        return await this.querySql(sql)
    }
}

module.exports = new UserModel

