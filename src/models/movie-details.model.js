const BaseModel = require('./base.model');
class MovieDetailsModel extends  BaseModel {
    async getDetail(id){
        let sql = `SELECT Users.userName, Movies.dateAired, Movies.name, Movies.description, Ratings.rating, Views.viewCount, Comments.comment, Movies.createdAt, Movies.actors, Image.imgUrl, Movies.id
FROM Movies
LEFT JOIN Ratings ON Movies.id = Ratings.moviesId
LEFT JOIN Views ON Movies.id = Views.moviesId
LEFT JOIN Comments ON Movies.id = Comments.moviesId
LEFT JOIN Image ON Movies.id = Image.moviesId
LEFT JOIN Users ON Movies.userId = Users.id
WHERE Movies.id = ${id};
`
        return await this.querySql(sql);
    }
    async getComment(id){
        let sql = `SELECT Users.userName, Comments.comment 
        FROM Comments
        JOIN Users ON Comments.userId = Users.id
        WHERE Comments.moviesId = ${id};
        `
        return await  this.querySql(sql);
    }
    async getGenresName(id){
        let sql = `SELECT Genre.name FROM Genremovies JOIN Movies ON Genremovies.moviesId = Movies.id
        JOIN Genre ON Genre.id = Genremovies.genreId
        WHERE Movies.id=${id} `
        return await  this.querySql(sql)
    }

    async getView(id){
        let sql = `UPDATE Views SET viewCount = viewCount + 1 WHERE moviesId = ${id}`
        return await this.querySql(sql)
    }

    async findByName(name){
        let sql = `SELECT *
        FROM Movies
        WHERE name LIKE '%${name}%';`
        return await this.querySql(sql)
    }
}
module.exports = new MovieDetailsModel();