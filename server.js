const http = require('http');
const url = require('url');
const fs = require('fs');
const qs = require("qs");
const { promisify } = require('util');
const PORT = 3456;
let handlers = {}
const readFileAsync = promisify(fs.readFile);
const registerController=require('./src/controllers/register.controller')
const loginController=require('./src/controllers/login.controller')
const MovieDetails = require('./src/controllers/movies-details.controller')
const MovieWatching = require('./src/controllers/movie-watching.controller')
const BaseController = require("./src/controllers/base.controller");
const logoutController =require('./src/controllers/logout.controller')
const adminController = require('./src/controllers/admin.controller');
const MovieCategories = require('./src/controllers/movie-categories.controller')
const MovieSearch = require('./src/controllers/movie-search.controller')
const homeController = require('./src/controllers/home.controller')
const commentController = require('./src/controllers/comment.controller')


let mimeTypes={
    'jpg' : 'images/jpg',
    'png' : 'images/png',
    'js' :'text/javascript',
    'css' : 'text/css',
    'svg':'image/svg+xml',
    'ttf':'font/ttf',
    'woff':'font/woff',
    'woff2':'font/woff2',
    'eot':'application/vnd.ms-fontobject',
    'mp4': 'video/mp4'
}

const server = http.createServer(async(req, res)=>{
    let urlPath = url.parse(req.url).pathname;
    const filesDefences = urlPath.match(/\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot|\.mp4/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, {'Content-Type': extension});
        fs.createReadStream(__dirname + req.url).pipe(res)
    } else {
        let cookieReq = req.headers?.cookie
        if (cookieReq) {
            let cookieValue = cookieReq.split(":")[1];
            if (cookieValue && cookieValue.length > 0) {
                let id = parseInt(cookieValue.split(",")[0])
                if (fs.existsSync('./session/user-' + id)) {
                    let dataSession = await BaseController.getTemplate('./session/user-' + id)
                    req.user = JSON.parse(dataSession.toString())
                } 
            }
        }
        let chosenHandler = (typeof (router[urlPath]) !== 'undefined') ? router[urlPath] : handlers.notfound;
        chosenHandler(req, res);
    }
})

handlers.notfound = async (req, res)=>{
    try {
        const data = await readFileAsync('./src/views/notfound.html', 'utf-8');
        res.writeHead(200, 'Success', {'Content-type': 'text/html'});
        res.write(data);
        res.end();
    } catch (err) {
        console.log(err);
        res.writeHead(500, 'Internal Server Error');
        res.end();
    }

};

handlers.details = async (req, res)=>{
    try {
        handleSearchByName(req,res);
        let data = await MovieDetails.getListDetails(req,res)
        res.writeHead(200, 'Success', {'Content-type': 'text/html'});
        res.write(data);
        res.end();
    } catch (err) {
        console.log(err);
        res.writeHead(500, 'Internal Server Error');
        res.end();
    }
};

handlers.watch = async (req, res)=>{
    try {
        handleSearchByName(req,res);
        let data = await MovieWatching.getListWatching(req,res)
        res.writeHead(200, 'Success', {'Content-type': 'text/html'});
        res.write(data);
        res.end();
    } catch (err) {
        console.log(err);
        res.writeHead(500, 'Internal Server Error');
        res.end();
    }
};

handlers.home = async (req, res) =>{
    homeController.getHomePage(req,res).catch(err=>{
        console.log(err.message)
    })
}

handlers.video = async (req, res)=>{
    await MovieWatching.getMovie(req, res);
}

handlers.login = async (req, res) => {
    loginController.login(req, res).catch(err => {
        console.log(err.message)
    })
}
handlers.register = async (req, res) => {
    registerController.getRegisterPage(req, res).catch(err => {
        console.log(err.message)
    })
}
handlers.categories = async (req, res)=>{
    try {
        handleSearchByName(req,res);
        let data = await MovieCategories.getListGenres(req,res)
        res.writeHead(200, 'Success', {'Content-type': 'text/html'});
        res.write(data);
        res.end();
    } catch (err) {
        console.log(err);
        res.writeHead(500, 'Internal Server Error');
        res.end();
    }
}
handlers.logout = async (req, res)=>{
    await logoutController.logout(req,res).catch(err=>{
       console.log(err.message)
   })
}

handlers.search = async (req, res)=>{
    try {
        handleSearchByName(req,res);
        let data = await MovieSearch.findByName(req,res)
        res.writeHead(200, 'Success', {'Content-type': 'text/html'});
        res.write(data);
        res.end();
    } catch (err) {
        console.log(err);
        res.writeHead(500, 'Internal Server Error');
        res.end();
    }
}

const handleSearchByName = async (req, res) => {
    await MovieSearch.onSearchByName(req, res).catch(err => {
        console.log(err.message)
    })
}

handlers.admin = async (req, res)=>{
    await adminController.getAdminPage(req, res).catch(err => {
        console.log(err.message)
    })
}

handlers.list_movies = async (req, res)=>{
    await adminController.getListMovies(req, res).catch(err => {
        console.log(err.message)
    })
}

handlers.list_episodes = async (req, res)=>{
    await adminController.getListEpisodes(req, res).catch(err => {
        console.log(err.message)
    })
}

handlers.addEp = async (req, res)=>{
    await adminController.addEpisodes(req, res).catch(err => {
        console.log(err.message)
    })
}

handlers.comment = async (req, res)=>{
    await commentController.commentMovie(req, res).catch(err => {
        console.log(err.message)
    })
}

router = {
    '/': handlers.home,
    '/home': handlers.home,
    '/register': handlers.register,
    '/login': handlers.login,
    '/movies-details': handlers.details,
    '/movies-watching': handlers.watch,
    '/video' : handlers.video,
    '/logout':handlers.logout,
    '/categories' : handlers.categories,
    '/search' : handlers.search,
    '/admin': handlers.admin,
    '/list_movies': handlers.list_movies,
    '/list_episodes': handlers.list_episodes,
    '/addEp': handlers.addEp,
    '/comment': handlers.comment,
}

server.listen(PORT, 'localhost', () => {
    console.log('server listening on port ' + PORT)
})
