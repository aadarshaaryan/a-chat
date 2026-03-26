// // Try to get from localStorage first
// let username = localStorage.getItem("username") || prompt("Enter your name:");

// // Save it for next refresh
// localStorage.setItem("username", username);

// // Save last messages
// localStorage.setItem("messages", messagesDiv.innerHTML);

// // Restore on load
// messagesDiv.innerHTML = localStorage.getItem("messages") || "";



const socket = io(); 
// Connect to server via Socket.IO

const messagesDiv = document.getElementById("messages"); 
// Container where messages appear

const input = document.getElementById("msgInput"); 
// Input field

let username = prompt("Enter your name:"); 
// Ask user name

if (!username) username = "Anonymous"; 
// Default name if empty


// 🟢 Send join event
socket.emit("userJoined", username); 
// Notify server that user joined


// =======================
// 🚀 EMOJI FUNCTIONS
// =======================

function addEmoji(src) {
  // Adds emoji placeholder into input
  input.value += `[img:${src}] `;
}

function formatMessage(text) {
  // Converts [img:filename] → actual <img>
  return text.replace(
    /\[img:(.*?)\]/g,
    '<img src="$1" class="emoji">'
  );
}


// =======================
// 💬 SEND MESSAGE
// =======================

function sendMessage() {
  const text = input.value.trim(); 
  // Get message text

  if (!text) return; 
  // Prevent empty messages

  socket.emit("sendMessage", {
    user: username,
    text: text
  });
  // Send message to server

  input.value = ""; 
  // Clear input
}


// =======================
// 📩 RECEIVE MESSAGE
// =======================

socket.on("receiveMessage", (data) => {
  const div = document.createElement("div");

  const isMe = data.user === username; 
  // Check if message is mine

  div.classList.add("message", isMe ? "sent" : "received");

  // 🔥 IMPORTANT: use innerHTML for emojis
  div.innerHTML = data.user + ": " + formatMessage(data.text);

  messagesDiv.appendChild(div);

  messagesDiv.scrollTop = messagesDiv.scrollHeight; 
  // Auto scroll to bottom
});


// =======================
// 🟢 USER JOINED
// =======================

socket.on("userJoinedMessage", (msg) => {
  addSystemMessage(msg);
});


// =======================
// 🔴 USER LEFT
// =======================

socket.on("userLeftMessage", (msg) => {
  addSystemMessage(msg);
});


// =======================
// ⚙️ SYSTEM MESSAGE
// =======================

function addSystemMessage(text) {
  const div = document.createElement("div");

  div.classList.add("message", "system");

  div.innerText = text; 
  // System messages don’t need emojis

  messagesDiv.appendChild(div);

  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}


// =======================
// ⌨️ ENTER KEY SUPPORT
// =======================

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});
