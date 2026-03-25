const socket = io();

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("msgInput");

let username = prompt("Enter your name:");

if (!username) username = "Anonymous";

// 🟢 Send join event
socket.emit("userJoined", username);

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  socket.emit("sendMessage", {
    user: username,
    text: text
  });

  input.value = "";
}

// 💬 Messages
socket.on("receiveMessage", (data) => {
  const div = document.createElement("div");

  const isMe = data.user === username;

  div.classList.add("message", isMe ? "sent" : "received");
  div.innerText = data.user + ": " + data.text;

  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// 🟢 Joined
socket.on("userJoinedMessage", (msg) => {
  addSystemMessage(msg);
});

// 🔴 Left
socket.on("userLeftMessage", (msg) => {
  addSystemMessage(msg);
});

// 🔧 helper
function addSystemMessage(text) {
  const div = document.createElement("div");
  div.classList.add("message", "system");
  div.innerText = text;

  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}