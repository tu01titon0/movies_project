const http = require('http');
const url = require('url');
const fs = require('fs');
// const qs = require('qs');
const { promisify } = require('util');
const PORT = 3333;
let handlers = {}
const readFileAsync = promisify(fs.readFile);

let mimeTypes={
    'jpg' : 'images/jpg',
    'png' : 'images/png',
    'js' :'text/javascript',
    'css' : 'text/css',
    'svg':'image/svg+xml',
    'ttf':'font/ttf',
    'woff':'font/woff',
    'woff2':'font/woff2',
    'eot':'application/vnd.ms-fontobject'
}

const server = http.createServer(async(req, res)=>{
    let urlPath = url.parse(req.url).pathname;
    const filesDefences = urlPath.match(/\.js|\.css|\.png|\.svg|\.jpg|\.ttf|\.woff|\.woff2|\.eot/);
    if (filesDefences) {
        const extension = mimeTypes[filesDefences[0].toString().split('.')[1]];
        res.writeHead(200, {'Content-Type': extension});
        fs.createReadStream(__dirname  + req.url).pipe(res)
    } else{
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

handlers.home = (req, res) =>{
    if(req.method === 'GET'){
        //code in here 
    }
}

router = {
    '/home': handlers.home,
}

server.listen(PORT, 'localhost', () => {
    console.log('server listening on port ' + PORT)
})
