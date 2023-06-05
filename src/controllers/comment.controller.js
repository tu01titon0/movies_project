const moviesModel = require ('./../models/movies.model');
const BaseController = require("./base.controller");


const qs = require('qs');
const url = require('url');
const {promisify} = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);
class CommentController {
    async commentMovie(req, res){
        if (req.method === 'POST' && req.user){
            let currentUserId = await req.user.id
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', async () => {
                try {
                    let commentMovie = qs.parse(data)
                    let {movieID, comment, url} = commentMovie
                    await moviesModel.newComment(currentUserId, movieID, comment)
                    res.writeHead(301, {location: url});
                    res.end()
                } catch(err){
                    res.writeHead(301, {location: url});
                    res.end('Failed to add movie');
                }
            })
        } else {
            res.writeHead(301, {location: '/home'});
        }
    }

}

module.exports =  new CommentController()