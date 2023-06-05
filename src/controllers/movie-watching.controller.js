const movieWatchingModel = require ('./../models/movie-watching.model');
const qs = require('qs');
const url = require('url');
const {promisify} = require("util");
const fs = require("fs");
const movieDetailsModel = require("../models/movie-details.model");
const readFileAsync = promisify(fs.readFile);
class MovieWatchingController {
    getMovie(req, res){
        const range = req.headers.range;
        if (!range) {
            res.status(400).send("Requires Range header");
        }

        // get video stats (about 61MB)
        const videoPath = "public/videos/" + qs.parse(url.parse(req.url).query).url;
        const videoSize = fs.statSync(videoPath).size;

        // Parse Range
        // Example: "bytes=32324-"
        const CHUNK_SIZE = 10 ** 6; // 1MB
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

        // Create headers
        const contentLength = end - start + 1;
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": "video/mp4",
        };

        // HTTP Status 206 for Partial Content
        res.writeHead(206, headers);

        // create video read stream for this particular chunk
        const videoStream = fs.createReadStream(videoPath, { start, end });

        // Stream the video chunk to the client
        videoStream.pipe(res);
    }
    async getListWatching(req,res){
        let id = qs.parse(url.parse(req.url).query).id;
        let episodeNumberName =  qs.parse(url.parse(req.url).query).episode;
        let urls = await movieWatchingModel.getEpisode(id,episodeNumberName)
        let movieWatching = await movieWatchingModel.getListWatching(id);
        let data = await readFileAsync('./src/views/movie-watching.html','utf-8');
        let eps=''
        movieWatching.forEach(ep=>{
            eps+= `<a href="/movies-watching?id=${id}&episode=${ep.episodeNumberName}">${ep.episodeNumberName}</a>`
        })
        if (urls.length > 0){
            data = data.replaceAll('{videos-url}',urls[0].moviesUrl)
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
        if(req.user){
            data=data.replace(`userName">`,'userName">' + req.user.email)
        }
        data = data.replace('{reviews}',html);
        data = data.replace('{name}',movieWatching[0].name)
        return data;
    }

}

module.exports =  new MovieWatchingController()