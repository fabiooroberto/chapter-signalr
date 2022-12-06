"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();

//Disable the send button until connection is established.
const generateRandomName = () =>
    Math.random().toString(36).substring(2, 10);

let username = generateRandomName();
const promptMessage = 'Enter your name:';
do {
    username = prompt(promptMessage, username);
    if (!username || username.startsWith('_') || username.indexOf('<') > -1 || username.indexOf('>') > -1) {
        username = '';
        promptMessage = 'Invalid input. Enter your name:';
    }
} while (!username)

const messageInput = document.getElementById('message');
messageInput.focus();

function createMessageEntry(encodedName, encodedMsg) {
    var entry = document.createElement('div');
    entry.classList.add("message-entry");
    if (encodedName === "_SYSTEM_") {
        entry.innerHTML = encodedMsg;
        entry.classList.add("alert");
        entry.classList.add("alert-primary");
    } else if (encodedName === username) {
        entry.classList.add("pull-right");
        entry.innerHTML = `<div class="media">
              <div class="media-body">
                <h5 class="mt-0">${encodedName}</h5>
                ${encodedMsg}
              </div>
              <img class="mr-3" src="/img/avatar.png" alt="Generic placeholder image">
            </div>`;
    } else {
        entry.classList.add("pull-left");
        entry.innerHTML = `<div class="media">
              <img class="mr-3" src="/img/avatar.png" alt="Generic placeholder image">
              <div class="media-body">
                <h5 class="mt-0">${encodedName}</h5>
                ${encodedMsg}
              </div>
            </div>`;
    }
    return entry;
}


function bindConnectionMessage(connection) {
    var messageCallback = function (name, message) {
        if (!message) return;
        var encodedName = name;
        var encodedMsg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        var messageEntry = createMessageEntry(encodedName, encodedMsg);

        var messageBox = document.getElementById('messages');
        messageBox.appendChild(messageEntry);
        messageBox.scrollTop = messageBox.scrollHeight;
    };
    connection.on('ReceiveMessageAll', messageCallback);
    connection.onclose(onConnectionError);
}

function onConnected(connection) {
    console.log('connection started');
    connection.send('SendMessageAllAsync', '_SYSTEM_', username + ' entrou no chat');
    document.getElementById('sendmessage').addEventListener('click', function (event) {
        if (messageInput.value) {
            connection.send('SendMessageAllAsync', username, messageInput.value);
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