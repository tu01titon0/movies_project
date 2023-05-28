const http = require('http');
const url = require('url');
const qs = require('qs');
const mysql = require('mysql');

const PORT = 3333;


const app = http.createServer((req, res) => {
    const pathUrl = url.parse(req.url).pathname;
    switch (pathUrl) {
        case '/':
            break;
    }
})

app.listen(PORT, 'localhost', () => {
    console.log('server listening on port ' + PORT)
})