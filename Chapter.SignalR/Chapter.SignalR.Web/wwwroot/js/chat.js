"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();

function getCookie(key) {
    var cookies = document.cookie.split(';').map(c => c.trim());
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith(key + '=')) return unescape(cookies[i].slice(key.length + 1));
    }
    return '';
}
var username = getCookie('fullName');

const messageInput = document.getElementById('message');
messageInput.focus();

function createMessageEntry(name, encodedMsg) {
    var entry = document.createElement('div');
    entry.classList.add("message-entry");
    if (name === "_SYSTEM_") {
        entry.innerHTML = encodedMsg;
        entry.classList.add("alert");
        entry.classList.add("alert-primary");
    } else if (name === username) {
        entry.classList.add("pull-right");
        entry.innerHTML = `<div class="media">
              <div class="media-body">
                <h5 class="mt-0">${name}</h5>
                ${encodedMsg}
              </div>
              <img class="mr-3" src="/img/avatar.png" alt="Generic placeholder image">
            </div>`;
    } else {
        entry.classList.add("pull-left");
        entry.innerHTML = `<div class="media">
              <img class="mr-3" src="/img/avatar.png" alt="Generic placeholder image">
              <div class="media-body">
                <h5 class="mt-0">${name}</h5>
                ${encodedMsg}
              </div>
            </div>`;
    }
    return entry;
}


function bindConnectionMessage(connection) {
    var messageCallback = function (name, message) {
        if (!message) return;
        var encodedMsg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var messageEntry = createMessageEntry(name, encodedMsg);

        var messageBox = document.getElementById('messages');
        messageBox.appendChild(messageEntry);
        messageBox.scrollTop = messageBox.scrollHeight;
    };
    connection.on('ReceiveMessageAll', messageCallback);
    connection.onclose(onConnectionError);
}

function onConnected(connection) {
    console.log('connection started');
    connection.send('SendMessageAllAsync', 'entrou no chat');
    document.getElementById('sendmessage').addEventListener('click', function (event) {
        if (messageInput.value) {
            connection.send('SendMessageAllAsync', messageInput.value);
        }

        messageInput.value = '';
        messageInput.focus();
        event.preventDefault();
    });
    document.getElementById('message').addEventListener('keypress', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('sendmessage').click();
            return false;
        }
    });
}

function onConnectionError(error) {
    if (error && error.message) {
        console.error(error.message);
    }
    var modal = document.getElementById('myModal');
    modal.classList.add('in');
    modal.style = 'display: block;';
}

bindConnectionMessage(connection);

connection.start()
    .then(function () {
        onConnected(connection);
    }).catch(function (err) {
        return console.error(err.toString());
    });