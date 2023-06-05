
const movieDetailsModel = require('./../models/movie-details.model');
const qs=require('qs');
const url = require('url');
const {promisify} = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);

class MoviesDetailsController {
    async getListDetails (req,res){
        let id = qs.parse(url.parse(req.url).query).id;
        let detailMovie = await movieDetailsModel.getDetail(id);
        let data = await readFileAsync('./src/views/movies-details.html','utf-8');
        data = data.replaceAll('{id}',detailMovie[0].id)
        data = data.replace('{actors}', detailMovie[0].actors)
        data = data.replace('{name}', detailMovie[0].name)
        data = data.replace('{dateAired}', detailMovie[0].dateAired.toLocaleDateString())
        data = data.replace('{createAt}', detailMovie[0].createdAt.toLocaleDateString())
        data = data.replace('{Views}', detailMovie[0].viewCount)
        data = data.replace('{rating}', detailMovie[0].rating)
        data = data.replace('{image1}', detailMovie[0].imgUrl)
        data = data.replace('{description}', detailMovie[0].description)
        let generNames = await movieDetailsModel.getGenresName(id)
        let genreName =''
        generNames.forEach((genre)=>{
            genreName += (genre.name + ' . ')
        })
        data = data.replace('{genre}',genreName)
        let html = ''
        let comments = await movieDetailsModel.getComment(id)
        comments.forEach((user)=>{
            html += `<div class="anime__review__item">
                <div class="anime__review__item__pic">
                    <img src="../../assets/img/anime/review-1.jpg" alt="">
                </div>
                <div class="anime__review__item__text">
                    <h6><span>${user.userName}</span></h6>
                    <p>${user.comment}</p>
                </div>
            </div>`
        })
        if(req.user){
            data=data.replace(`userName">`,'userName">' + req.user.email)
        }
        data = data.replace('{movieID}',id)
        data = data.replace('{url}','/movies-details?id='+id)
        data = data.replace('{reviews}',html)
        return data;
    }

}


module.exports= new MoviesDetailsController()