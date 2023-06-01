const movieDetailsModel = require("../models/movie-details.model");
const qs = require('qs');
const url = require('url');
const {promisify} = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);

class getCommentController {
    async getComment(id){
        let data = await readFileAsync('./src/views/movies-details.html','utf-8');
        let html = ''
        let comments = await movieDetailsModel.getComment(id)
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
module.exports = new getCommentController()