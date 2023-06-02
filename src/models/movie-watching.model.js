const BaseModel = require('./base.model');
class MovieWatchingModel extends BaseModel{
    async getListWatching(id){
        let sql = `SELECT m.id AS movie_id, e.id AS episode_id, e.name AS episodeName, e.moviesUrl, e.numberEpisodes AS episodeNumberName, m.name 
                    FROM Movies m
                    JOIN Episodes e ON m.id = e.moviesId
                    WHERE m.id = ${id};`
        return await this.querySql(sql)
    }
    async getEpisode(movieId,numberEpisodes){
        let sql = `SELECT Episodes.moviesUrl, Image.imgUrl
        FROM Episodes
        JOIN Movies ON Movies.id = Episodes.moviesId
        JOIN Image ON Image.moviesId = Movies.id
        WHERE Movies.id=${movieId} AND Episodes.numberEpisodes=${numberEpisodes}
      `
        return await  this.querySql(sql);
    }
    async getComment(id){
        let sql = `SELECT Users.userName, Comments.comment 
        FROM Comments
        JOIN Users ON Comments.userId = Users.id
        WHERE Comments.moviesId = ${id};
        `
        return await  this.querySql(sql);
    }
}

module.exports = new MovieWatchingModel();