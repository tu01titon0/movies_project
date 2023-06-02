const fs = require("fs");
class BaseController {
    getTemplate(pathFile) {
        return new Promise((resolve, reject) => {
            fs.readFile(pathFile, 'utf8', (err, data) => {
                if (err) {
                    reject(err)
                }
                resolve(data);
            } )
        })
    }

    writeDataToFile(pathFile, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(pathFile, data, 'utf8', (err) => {
                if (err) {
                    reject(err.message)
                }
                resolve();
            } )
        })
    }
    deleteFileData (filePath) {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err.message)
                }
                resolve()
            })
        })
    }
}
module.exports = new BaseController;