const BaseModel = require('./base.model');

class MovieSearchModel extends BaseModel{
    async findByName(name){
        let sql = `SELECT M.name AS movieName, M.id AS movieId, I.imgUrl, V.viewCount, GROUP_CONCAT(G.name) AS genreNames
FROM Movies M
JOIN Image I ON M.id = I.moviesId
JOIN Views V ON M.id = V.moviesId
JOIN Genremovies GM ON M.id = GM.moviesId
JOIN Genre G ON GM.genreId = G.id
WHERE M.name LIKE '%${name}%'
GROUP BY M.id, M.name, I.imgUrl, V.viewCount;

`
        return await this.querySql(sql)
    }
}
module.exports = new MovieSearchModel;