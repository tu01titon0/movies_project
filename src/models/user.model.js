const BaseModel = require("./base.model");
const baseModel = require("./base.model");
class UserModel extends BaseModel {
    async findUserByName(name) {
        const sql=`select * from users where userName='${name}'`
        return await this.querySql(sql)
    }

    async createUser(name,email,password) {
        const sql = `CALL addUser('${name}','${password}','${email}')`
        return await  this.querySql(sql)
    }
}

module.exports = new UserModel

