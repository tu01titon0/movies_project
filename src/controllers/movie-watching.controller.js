const movieWatchingModel = require ('./../models/movie-watching.model');
const getComment = require ('./../controllers/getcomment.comtroller')
const qs = require('qs');
const url = require('url');
const {promisify} = require("util");
const fs = require("fs");
const movieDetailsModel = require("../models/movie-details.model");
const readFileAsync = promisify(fs.readFile);

class MovieWatchingController {
    async getListWatching(req,res){
        let id = qs.parse(url.parse(req.url).query).id;
        let episodeId =  qs.parse(url.parse(req.url).query).episode_id;
        let urls = await movieWatchingModel.getEpisode(episodeId,id)
        let movieWatching = await movieWatchingModel.getListWatching(id);
        let data = await readFileAsync('./src/views/movie-watching.html','utf-8');
        let eps=''
        movieWatching.forEach(ep=>{
            eps+= `<a href="/movies-watching?id=${id}&episode_id=${ep.episode_id}">${ep.episodeName}</a>`
        })
        if (urls.length > 0){
            data = data.replace('{videos-url}',urls[0].moviesUrl)
        }
        data = data.replace('{ep}', eps)
        let html = ''
        let comments = await movieWatchingModel.getComment(id)
        comments.forEach((user, comment)=>{
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
        data = data.replace('{reviews}',html)
        return data;
    }

}

module.exports =  new MovieWatchingController()