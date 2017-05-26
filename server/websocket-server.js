//websocket server
//https://www.npmjs.com/package/websocket - https://github.com/theturtle32/WebSocket-Node
//good guide:
//https://medium.com/@martin.sikora/node-js-websocket-simple-chat-tutorial-2def3a841b61
'use strict';
const http = require('http');
const WebSocketServer = require('websocket').server;
const formatDate = require('./utilities/formatdate');

const wsServer = http.createServer((req, res) => {
    //just for sockets - see below
});
// .listen(1337, () => {
//     console.log('socket server listening on 1337');
// });

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

module.exports = wsServer;