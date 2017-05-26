'use strict';

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const httpPort = process.argv[2] || 80;
const wsPort = 1337;
const mimeTypes = require('./utilities/mimetypes');
const wsServer = require('./websocket-server');

//http server for main site and static files
const server = http.createServer();
server.on('request', (req, res) => {
    const parsedUrl = url.parse(req.url);
    console.log(parsedUrl);
    let pathName = `../client${parsedUrl.pathname}`;

    if(req.method === 'POST' && parsedUrl.path === '/login-processor') {
        //login processing logic here?
        console.log('post passed to login processor:', req);
        validateUser({username: 'username', password: 'password'})
            .then(auth => {
                console.log('returned from promise:', auth);
                if(auth) {
                    res.writeHead(301, { Location: 'http://localhost/dashboard.html' });
                    return res.end();
                } else {
                    return res.send(JSON.stringify({ auth: false, error: 'invalid login!' }));
                }
            });        
    }

    function validateUser() {
        return new Promise((resolve, reject) => {
            console.log('validating user!');
            resolve(true);
        });
    }

    fs.exists(pathName, exists => {
        if(!exists) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            return res.end('<h1>Not Found!</h1>');
        }

        if(fs.statSync(pathName).isDirectory()) {
            pathName += '/index.html';
        }

        fs.readFile(pathName, (err, data) => {
            if(err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'text/html' });
                return res.end(`<h1>Server Error</h1>${err}`);
            }
            const ext = path.parse(pathName).ext;

            //main chat screen route
            if(parsedUrl.path === '/chat-index.html') {
                console.log('we need to authenticate here!');

                //start chat server
                wsServer.listen(wsPort, () => {
                    console.log('websocket server running on port:', wsPort);
                });
            }

            

            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/html' });
            return res.end(data);
        });
    });
});

server.on('error', err => console.error(err));

server.listen(httpPort, () => {
    console.log('http server running on port:', httpPort);
});