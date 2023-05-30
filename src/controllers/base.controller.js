const fs = require("fs");
class BaseController {
    getTemplate(pathFile) {
        return new Promise((resolve, reject) => {
            fs.readFile(pathFile, 'utf8', (err, data) => {
                if (err) {
                    reject(err.message)
                }
                resolve(data);
            } )
        })
    }
}
module.exports = new BaseController;