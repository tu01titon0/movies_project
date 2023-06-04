const BaseModel = require('./base.model');


class HomeModel extends BaseModel{
    async getBackGround(){
        const sql ='SELECT * FROM  homeBackground'
        return this.querySql(sql)
    }
    async getTrending(){
        const sql='SELECT * FROM  trending'
        return this.querySql(sql)
    }
    async getPopular(){
        const sql='SELECT * FROM  popular'
        return this.querySql(sql)
    }
    async getRecently(){
        const sql='SELECT * FROM  recently'
        return this.querySql(sql)
    }
    async getAction(){
        const sql='SELECT * FROM  action'
        return this.querySql(sql)
    }

}

module.exports= new HomeModel