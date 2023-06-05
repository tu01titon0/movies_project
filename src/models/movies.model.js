const BaseModel = require('./base.model');

class MoviesModel extends BaseModel{
    async findMovieByName(name){
        let sql = `Select * form Movies where name = 'name'`;
        return await this.querySql(sql);
    }
    
    async addMovie(name, userId, dateAired, actors, description){
        let sql = `INSERT INTO Movies (name, userId, dateAired, actors, description) 
        VALUES ('${name}','${userId}', '${dateAired}', '${actors}','${description}')`;
        return await this.querySql(sql);
    }
    
    async addImgMovie(movieId, imgUrl, defaultImg){
        let sql = `INSERT INTO Image (moviesId, imgUrl, defaulImg)
        VALUES (${movieId}, '${imgUrl}', ${defaultImg})`;
        return await this.querySql(sql);
    }
    
    async findGenreName(name){
        let sql = `SELECT * FROM Genre
        WHERE LOWER(name) = '${name}'`;
        return await this.querySql(sql);
    }
    
    async createGenre(name){
        let sql = `INSERT INTO Genre (name)
        VALUES ('${name}')`;
        return await this.querySql(sql);
    }
    
    async createGenreMovies(movieId, genreId){
        let sql = `INSERT INTO Genremovies(moviesId, genreId )
        VALUES (${movieId}, ${genreId})`;
        return await this.querySql(sql);
    }
    
    async ShowAllMovies(){
        let sql = `Select Movies.name, Movies.description, Movies.dateAired, Movies.actors, Image.imgUrl, Movies.id
        FROM Movies
        JOIN Image ON Movies.id = Image.moviesId
        `;
        return await this.querySql(sql);
    }
    
    async getListEp(movieID){
        let sql = `SELECT * FROM Episodes WHERE Episodes.moviesId = ${parseInt(movieID)}
        `;
        return await this.querySql(sql);
    }
    
    async newEpisode(movieId, name, numberEpisodes, moviesUrl){
        let sql = `INSERT INTO Episodes (moviesId, name, numberEpisodes, moviesUrl)
        VALUES
            (${parseInt(movieId)}, '${name}', ${parseInt(numberEpisodes)}, '${moviesUrl}')`;
        return await this.querySql(sql); 
    }
    
    async newComment(userId, moviesId, comment){
        let sql = `INSERT INTO Comments (userId, moviesId, comment)
        VALUES (${parseInt(userId)}, ${parseInt(moviesId)}, '${comment}');
        `;
        return await this.querySql(sql); 
    }
    
}
module.exports= new MoviesModel();