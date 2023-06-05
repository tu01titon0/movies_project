const movieDetailsModel = require('./../models/movie-search.model');
const qs=require('qs');
const url = require('url');
const {promisify} = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);

class MovieSearchController {
    async findByName(req, res){
        let name = qs.parse(url.parse(req.url).query).name;
        let nameMovie = await movieDetailsModel.findByName(name)
        let data = await readFileAsync('./src/views/movie-search.html','utf-8');
        let listMovies=''
        nameMovie.forEach(name=>{
            listMovies += ` <div class="product__item__pic set-bg" data-setbg="../../public/images/${name.imgUrl}">
                                        <div class="comment"><i class="fa fa-comments"></i></div>
                                        <div class="view"><i class="fa fa-eye"></i>${name.viewCount}</div>
                                    </div>
                                    <div class="product__item__text">
                                        <ul>
                                            <li>${name.genreNames}</li>
                                        </ul>
                                        <h5><a href="/movies-watching?id=${name.movieId}&episode=1">${name.movieName}</a></h5>
                                    </div>`
        })
        if(req.user){
            data=data.replace(`userName">`,'userName">' + req.user.email)
        }
        data = data.replace('nameOfMovie',listMovies);
        data = data.replaceAll('{name}', name);
        return data;
    }
    async  onSearchByName(req, res){
        if (req.method==='POST'){
            let data =''
            req.on('data',chunk=>{
                data+=chunk
            })
            req.on('end',()=>{
                let _data = qs.parse(data)
                let {name} = _data
                fs.readFile('./src/views/movie-search.html','utf-8',function (err, datahtml) {
                    res.writeHead(301,{location:`/search?name=${name}`})
                    res.write(datahtml)
                    res.end()
                })
            })
        }
    }
}
module.exports = new MovieSearchController;