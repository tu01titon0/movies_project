const qs = require('qs');
const moviesModel = require('../models/movies.model');
const userModel = require('../models/user.model');
const fs = require('fs');
const { ROLE_ADMIN } = require("./RolerConst");
const BaseController = require("./base.controller");
const multer = require('multer')
const path = require('path')
const querystring = require('querystring');
const formidable = require('formidable')
const url = require('url');

class AdminController {
    async getAdminPage(req, res) {
        if (req.user) {
            let currentUserId = await req.user.id;
            if (req.method === 'GET') {
                let rollUser = await userModel.findRoleUser(currentUserId);
                let role = JSON.parse(Buffer.from(JSON.stringify(rollUser[0]))).role.data[0];
                if (role === ROLE_ADMIN) {

                    let html = await BaseController.getTemplate('./src/views/admin.html');
                    if(req.user){
                        html=html.replace(`userName">`,'userName">' + req.user.email)
                    }
                    res.writeHead(200, { 'Content-type': 'text/html' });
                    res.write(html);
                    return res.end();
                } else {
                    res.writeHead(301, { Location: '/home' });
                }

                return res.end();
            } else {
                let fileName = ''
                const uploadDir = path.join(__dirname, '../../public/images');
                const form = new formidable.IncomingForm();
                const storage = await multer.diskStorage({
                    destination: function (req, file, cb) {
                        cb(null, uploadDir);
                    },
                    filename: function (req, file, cb) {
                        fileName = Date.now() + path.extname(file.originalname);
                        cb(null, fileName);
                    }
                });
                const upload = await multer({ storage: storage });
                let uploaded = false
                await upload.single('image')(req, res, (err) => {
                    if (err) {
                        console.error('Error uploading file:', err);
                        res.statusCode = 500;
                    } else {
                        console.log('Image uploaded successfully!');
                        uploaded = true
                    }
                });

                await new Promise((resolve, reject) => {
                    form.parse(req, async (err, fields, files) => {
                        if (err) {
                            console.error('Error parsing form:', err);
                            res.statusCode = 500;
                            res.end('Internal Server Error');
                            reject(err);
                        } else {
                            const name = fields.name;
                            const description = fields.description;
                            const genre = fields.genre;
                            const dateAired = fields.dateAired;
                            const actors = fields.actors;
                
                            try {
                                const addMovie = await moviesModel.addMovie(name, currentUserId, dateAired, actors, description);
                                if (uploaded && addMovie) {
                                    await moviesModel.addImgMovie(addMovie.insertId, fileName, true);
                                    let genreNames = genre.split(',').map(item => item.trim());
                
                                    for (let element of genreNames) {
                                        let genreName = await moviesModel.findGenreName(element.toLowerCase());
                                        if (genreName.length > 0) {
                                            await moviesModel.createGenreMovies(addMovie.insertId, genreName[0].id);
                                        } else {
                                            let newGenre = await moviesModel.createGenre(element);
                                            await moviesModel.createGenreMovies(addMovie.insertId, newGenre.insertId);
                                        }
                                    }
                                    console.log('Created Movie');
                                    res.writeHead(301, { 'Location': '/list_movies' });
                                    res.end();
                                }
                            } catch (error) {
                                console.error('Error adding movie:', error);
                                res.writeHead(301, { 'Location': '/admin'  });
                                res.end('Failed to add movie');
                            }
                            resolve();
                        }
                    });
                });
            }
        } else {
            res.writeHead(301, { Location: '/home' });
        }
    }

    async getListMovies(req, res) {
        if (req.user) {
            let currentUserId = await req.user.id;
            let rollUser = await userModel.findRoleUser(currentUserId);
            let role = JSON.parse(Buffer.from(JSON.stringify(rollUser[0]))).role.data[0];
            if (role === ROLE_ADMIN) {
                let html = await BaseController.getTemplate('./src/views/list_movies.html');
                let newHtml=''
                let movies = await moviesModel.ShowAllMovies()
                let i = 0
                movies.forEach(movie => {
                    newHtml += `<tr>
                        <th scope="row">${++i}</th>
                        <td scope="col"><div class="product__sidebar__comment__item__pic">
                        <img src="../../public/images/${movie.imgUrl}" alt="">
                    </div></td>
                        <td scope="col">${movie.name}</td>
                        <td scope="col">${movie.description}</td>
                        <td scope="col">${movie.dateAired.toLocaleDateString()}</td>
                        <td scope="col">${movie.actors}</td>
                        <td scope="col">
                        <a href=/list_episodes?id=${movie.id} class ='btn btn-primary'>List Episodes</a>
                        <a href=/delete?id=${movie.id} class ='btn btn-danger'>Delete Movie</a></td>
                    </tr>`
                });
                html = html.replace('{list-movies}',newHtml)
                if(req.user){
                    html=html.replace(`userName">`,'userName">' + req.user.email)
                }
                res.writeHead(200, { 'Content-type': 'text/html' });
                res.write(html);
            } else {
                res.writeHead(301, { Location: '/home' });
            }
            return res.end();
        } else {
            res.writeHead(301, { Location: '/home' });
        }

    }
    
    async getListEpisodes(req, res){
        let movieID =  qs.parse(url.parse(req.url).query).id;
        if (req.user && movieID ) {
            let currentUserId = await req.user.id;
            let rollUser = await userModel.findRoleUser(currentUserId);
            let role = JSON.parse(Buffer.from(JSON.stringify(rollUser[0]))).role.data[0];
            if (role === ROLE_ADMIN) {
                let html = await BaseController.getTemplate('./src/views/list_episodes.html');
                let newHtml=''
                let eps = await moviesModel.getListEp(movieID)
                let i = 0
                eps.forEach(ep => {
                    newHtml += `<tr>
                        <th scope="row">${++i}</th>
                        <td scope="col">${ep.name}</td>
                        <td scope="col">${ep.numberEpisodes}</td>
                        <td scope="col">${ep.moviesUrl}</td>
                    </tr>`
                });
                if(req.user){
                    html=html.replace(`userName">`,'userName">' + req.user.email)
                }
                html = html.replace('{list-episodes}',newHtml)
                html = html.replace('{href}',`/addEp?id=${movieID}`)
                
                res.writeHead(200, { 'Content-type': 'text/html' });
                res.write(html);
            } else {
                res.writeHead(301, { Location: '/home' });
            }
            return res.end();
        } else {
            res.writeHead(301, { Location: '/home' });
        }
    }
    
    async addEpisodes(req, res){
        let movieID =  qs.parse(url.parse(req.url).query).id;
        if (req.user && movieID) {
            let currentUserId = await req.user.id;
            if (req.method === 'GET') {
                let rollUser = await userModel.findRoleUser(currentUserId);
                let role = JSON.parse(Buffer.from(JSON.stringify(rollUser[0]))).role.data[0];
                if (role === ROLE_ADMIN) {

                    let html = await BaseController.getTemplate('./src/views/addEp.html');
                    html = html.replace('{movieId}', movieID)
                    res.writeHead(200, { 'Content-type': 'text/html' });
                    if(req.user){
                        html=html.replace(`userName">`,'userName">' + req.user.email)
                    }
                    res.write(html);
                    return res.end();
                } else {
                    res.writeHead(301, { Location: '/home' });
                }

                return res.end();
            } else {
                let fileName = ''
                const uploadDir = path.join(__dirname, '../../public/videos');
                const form = new formidable.IncomingForm();
                const storage = await multer.diskStorage({
                    destination: function (req, file, cb) {
                        cb(null, uploadDir);
                    },
                    filename: function (req, file, cb) {
                        fileName = Date.now() + path.extname(file.originalname);
                        cb(null, fileName);
                    }
                });
                const upload = await multer({ storage: storage });
                let uploaded = false
                await upload.single('image')(req, res, (err) => {
                    if (err) {
                        console.error('Error uploading file:', err);
                        res.statusCode = 500;
                    } else {
                        console.log('Image uploaded successfully!');
                        uploaded = true
                    }
                });

                await new Promise((resolve, reject) => {
                    form.parse(req, async (err, fields, files) => {
                        if (err) {
                            console.error('Error parsing form:', err);
                            res.statusCode = 500;
                            res.end('Internal Server Error');
                            reject(err);
                        } else {
                            const name = fields.name;
                            const numberEp = fields.numberEp;
                    
                            try {
                                const addEp = await moviesModel.newEpisode(movieID, name, numberEp, fileName)
                                
                                if (uploaded && addEp) {
                                    console.log('Created Ep ');
                                    res.writeHead(301, { 'Location': `/list_episodes?id=${movieID}` });
                                    res.end();
                                }
                            } catch (error) {
                                console.error('Error adding movie:', error);
                                res.writeHead(301, { 'Location': `/addEp?id=${movieID}` });
                                res.end('Failed to add ');
                            }
                            resolve();
                        }
                    });
                });
            }
        } else {
            res.writeHead(301, { Location: '/home' });
        }
    }
}

module.exports = new AdminController()