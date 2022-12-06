"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatGrupo").build();

function getCookie(key) {
    var cookies = document.cookie.split(';').map(c => c.trim());
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].startsWith(key + '=')) return unescape(cookies[i].slice(key.length + 1));
    }
    return '';
}
var username = getCookie('fullName');

connection.on("Send", function (groupName, fullName, message) {
    var entry = document.createElement('div');
    entry.classList.add("message-entry");
    if (username == fullName) {
        entry.classList.add("pull-right");
    }
    else {
        entry.classList.add("pull-left");
    }
    entry.innerHTML = `<div class="media">
              <img class="mr-3" src="/img/avatar.png" alt="Generic placeholder image">
              <div class="media-body">
                <p class="mt-0"><b>${fullName}</b> (${groupName})</p>
                <p>${message}</p>
              </div>
            </div>`;
    document.getElementById("messages").appendChild(entry);
    var elem = document.getElementById("messages");
    elem.scrollTop = elem.scrollHeight;
});
connection.on("ReceiveMessage", function (message) {
    var li = document.createElement("li");
    li.textContent = message;
    document.getElementById("messages").appendChild(li);
});
document.getElementById("groupmsg").addEventListener("click", async (event) => {
    var groupName = document.getElementById("group-name").value;
    var groupMsg = document.getElementById("group-message-text").value;
    if (groupMsg) {
        try {
            await connection.invoke("SendMessageToGroup", groupName, groupMsg);
            document.getElementById("group-message-text").value = "";
        }
        catch (e) {
            console.error(e.toString());
            alert(e.toString());
        }
    }
    else {
        alert("Insira uma mensagem");
    }
    event.preventDefault();
});
document.getElementById("join-group").addEventListener("click", async (event) => {
    var groupName = document.getElementById("group-name").value;
    if (groupName) {

        try {
            await connection.invoke("AddToGroup", groupName);
        }
        catch (e) {
            console.error(e.toString());
        }
    }
    else {
        alert("Escolha um grupo")
    }
    event.preventDefault();
});
document.getElementById("leave-group").addEventListener("click", async (event) => {
    var groupName = document.getElementById("group-name").value;
    try {
        await connection.invoke("RemoveFromGroup", groupName);
    }
    catch (e) {
        console.error(e.toString());
    }
    event.preventDefault();
});

(async () => {
    try {
        await connection.start();
    }
    catch (e) {
        console.error(e.toString());
    }
})();