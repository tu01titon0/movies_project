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
        let listCategories=''
        listGenre.forEach(cate=>{
            listCategories += ` <div class="product__item__pic set-bg" data-setbg="../../public/images/${cate.imgUrl}">                                 
                                        <div class="comment"><i class="fa fa-comments"></i> 11</div>
                                        <div class="view"><i class="fa fa-eye"></i>${cate.viewCount}</div>
                                    </div>
                                    <div class="product__item__text">
                                        <ul>                                     
                                            <li>${cate.name}</li> 
                                        </ul>
                                        <h5><a href="/movies-details?id=${cate.movieId}&episode=1">${cate.movieName}</a></h5>
                                    </div>`
        })
        if(req.user){
            data=data.replace(`userName">`,'userName">' + req.user.email)
        }
        data = data.replace('{categories}',listCategories)
        data = data.replaceAll('{Genre}',listGenre[0].name)
        return  data
    }
}
module.exports = new CategoriesController;