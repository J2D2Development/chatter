'use strict';

const http = require('http');
const WebSocketServer = require('websocket').server
const fs = require('fs');
const url = require('url');
const path = require('path');
const port = process.argv[2] || 80;
const mimeTypes = require('./utilities/mimetypes');

//websocket server- can we do this with net?
//looks like a no- try using https://www.npmjs.com/package/websocket - https://github.com/theturtle32/WebSocket-Node
//good guide:
//https://medium.com/@martin.sikora/node-js-websocket-simple-chat-tutorial-2def3a841b61
const wsServer = http.createServer((req, res) => {
    //just for sockets - see below
})
wsServer.listen(1337, () => {
    console.log('socket server listening on 1337');
});

let clients = [];
const ws = new WebSocketServer({
    httpServer: wsServer
});
ws.on('connect', connection => {
    //console.log('new connection:', connection);
});
ws.on('request', req => {
    console.log(new Date());
    console.log('Connection from:', req.origin);
    const connection = req.accept(null, req.origin);
    const index = clients.push(connection) - 1;

    connection.on('message', message => {
        var obj = {
          time: (new Date()).getTime(),
          text: message.utf8Data,
          author: 'test'
        };

        // broadcast message to all connected clients
        var json = JSON.stringify({ type:'message', data: obj });
        for(let i = 0; i < clients.length; i += 1) {
          clients[i].sendUTF(json);
        }
    });
})

//http server for main site and static files
const server = http.createServer();
server.on('request', (req, res) => {
    const parsedUrl = url.parse(req.url);
    let pathName = `../client${parsedUrl.pathname}`;

    fs.exists(pathName, exist => {
        if(!exist) {
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
                return res.end(`<h1>Not Found!</h1>${err}`);
            }
            const ext = path.parse(pathName).ext;
            res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'text/plain' });
            return res.end(data);
        });
    });
});

server.on('error', err => console.error(err));

server.listen(port, () => {
    console.log('server listening!');
});