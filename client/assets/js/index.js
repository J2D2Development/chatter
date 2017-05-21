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
            const json = JSON.parse(message.data);
            const type = json.type;
            const data = json.data;
            if(type === 'history') {
                data.forEach(d => {
                    const historyJson = JSON.parse(d);
                    addPost(historyJson.data);
                });
            } else {
                addPost(data);
            }
        }

        function addPost(data) {
            messagesWrapper.innerHTML += `
                    <div class="message-wrapper">
                        <div class="message-text">${data.text}</div>
                        <div class="message-footer">
                            <div class="message-author">${data.author}</div>
                            <div class="message-time">${data.time}</div>
                    </div>
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