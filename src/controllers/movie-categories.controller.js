const categories = require('./../models/movie-categories.model');
const qs=require('qs');
const url = require('url');
const {promisify} = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);

class CategoriesController {
    async getListGenres(req, res){
        let nameOfGenres = qs.parse(url.parse(req.url).query).name;
        let listGenre = await categories.getListGenre(nameOfGenres);
        let data = await readFileAsync('./src/views/movie-categories.html','utf-8');
        let categorie=''
        listGenre.forEach(cete=>{
            categorie += ` <div class="product__item__pic set-bg" data-setbg="../../public/images/${cete.imgUrl}">                                 
                                        <div class="comment"><i class="fa fa-comments"></i> 11</div>
                                        <div class="view"><i class="fa fa-eye"></i>${cete.viewCount}</div>
                                    </div>
                                    <div class="product__item__text">
                                        <ul>                                     
                                            <li>${cete.name}</li> 
                                        </ul>
                                        <h5><a href="/movies-watching?id=${cete.movieId}&episode=1">${cete.movieName}</a></h5>
                                    </div>`
        })
        data = data.replace('{categories}',categorie)
        data = data.replaceAll('{Genre}',listGenre[0].name)
        return  data
    }
}
module.exports = new CategoriesController;