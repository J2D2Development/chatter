(function(window) {
    'use strict';
    window.addEventListener('DOMContentLoaded', function() {
        const talkContent = document.querySelector('#talk-content');
        const talkSubmit = document.querySelector('#talk-submit');
        const messagesWrapper = document.querySelector('#messages-wrapper');

        if(!window.WebSocket) {
            alert('Sorry, your browser does not support web sockets!');
        }

        const connection = new WebSocket('ws://localhost:1337/server');
        connection.onopen = function() {
            console.log('connection open?');
        }

        connection.onerror = function(err) {
            console.log('connection error:', err);
        }

        connection.onmessage = function(message) {
            console.log('message!', message);
            const data = JSON.parse(message.data).data;
            console.log(data.text);
            messagesWrapper.innerHTML += `
                <p>${data.text}</p>
                <em>${data.author}</em>
            `;
        }

        talkSubmit.addEventListener('click', function() {
            const message = talkContent.value;
            if(message) { submitMessage(message); }
        }, false);

        talkContent.addEventListener('keyup', function(evt) {
            if(evt.keyCode === 13) {
                const message = talkContent.value;
                if(message) { submitMessage(message); }
            }
        });

        function submitMessage(msg) {
            //messagesWrapper.innerHTML += `<p>${msg}</p>`;
            connection.send(msg);
            talkContent.value = '';
        }
    });
})(window);