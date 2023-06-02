const BaseModel = require('./base.model');

class Categories extends BaseModel{
    async getListGenre(name){
        let sql = `SELECT Genre.name, Genre.id AS genreId, Movies.id AS movieId, Movies.name AS movieName, Image.imgUrl, Views.viewCount
FROM Genre
JOIN Genremovies ON Genre.id = Genremovies.genreId
JOIN Movies ON Genremovies.moviesId = Movies.id
JOIN Image ON Movies.id = Image.moviesId
JOIN Views ON Movies.id = Views.moviesId
WHERE Genre.name='${name}';
`
        return await this.querySql(sql);
    }
}
module.exports= new Categories();