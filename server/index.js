'use strict';

const http = require('http');
const WebSocketServer = require('websocket').server
const fs = require('fs');
const url = require('url');
const path = require('path');
const port = process.argv[2] || 80;
const mimeTypes = require('./utilities/mimetypes');

//websocket server
//https://www.npmjs.com/package/websocket - https://github.com/theturtle32/WebSocket-Node
//good guide:
//https://medium.com/@martin.sikora/node-js-websocket-simple-chat-tutorial-2def3a841b61
const wsServer = http.createServer((req, res) => {
    //just for sockets - see below
}).listen(1337, () => {
    console.log('socket server listening on 1337');
});

let clients = [], posts = [], userCount = 0;
const ws = new WebSocketServer({
    httpServer: wsServer
});
ws.on('connect', connection => {
    //console.log('new connection:', connection);
});
ws.on('request', req => {
    let connection = req.accept(null, req.origin);
    connection.name = userCount;
    userCount += 1;
    const index = clients.push(connection) - 1;

    
    console.log(clients[index].name + ' has joined');
    if(posts.length > 0) {
        connection.sendUTF(JSON.stringify({ type: 'history', data: posts }))
    }

    const welcome = JSON.stringify({
        type: 'message', 
        data: { 
            time: formatDate(new Date()),
            text: `${connection.name} has joined the chat!`, 
            author: 'System'
        } 
    });
    broadcastToGroup(clients, welcome);

    connection.on('message', message => {
        const obj = {
          time: formatDate(new Date()),
          text: message.utf8Data,
          author: connection.name
        };

        console.log('message sent:', obj.text);

        // broadcast message to all connected clients
        const json = JSON.stringify({ type:'message', data: obj });
        broadcastToGroup(clients, json);
    });

    connection.on('close', () => {
        const left = clients.splice(index, 1);
        const obj = { 
            time: formatDate(new Date()),
            text: `${connection.name} has left the chat`,
            author: 'System'
        }
        console.log(obj.text);
        //TODO - this doesn't fire on some leaving the chat?  why not?
        const json = JSON.stringify({ type: 'message', data: obj });
        broadcastToGroup(clients, json);
    });
});

function broadcastToGroup(recipients, message) {
    posts.push(message);
    recipients.forEach(recipient => {
        broadcast(recipient, message);
    });
}

function broadcast(recipient, message) {
    recipient.sendUTF(message);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = monthNameMatrix[date.getMonth() - 1];
    const day = date.getDate();
    const hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if(minutes.toString().length === 1) {
        minutes = '0' + minutes.toString();
    }

    if(seconds.toString().length === 1) {
        seconds = '0' + seconds.toString();
    }

    return `${month} ${day}, ${year} at ${hours}:${minutes}:${seconds}`;
}

const monthNameMatrix = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April', 5: 'May', 6: 'June', 7: 'July', 8: 'August', 9: 'September', 10: 'October', 11: 'November', 12: 'December'
};

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