const express = require("express");
// Imports Express framework → used to handle routes & serve files

const http = require("http");
// Imports Node.js HTTP module → used to create actual server

const { Server } = require("socket.io");
// Imports Socket.IO server class → enables real-time communication


const app = express();
// Creates an Express application instance

const server = http.createServer(app);
// Creates HTTP server and attaches Express app to it
// This server will handle both HTTP requests and sockets

const io = new Server(server);
// Creates Socket.IO server and attaches it to HTTP server
// Now HTTP + WebSocket run on same server


app.use(express.static(__dirname));
// Serves static files (HTML, CSS, JS) from current folder
// So when browser opens localhost:3000 → it gets index.html etc.


io.on("connection", (socket) => {
  // Runs every time a new user connects
  // "socket" = that specific user's connection object

  console.log("User connected:", socket.id);
  // Logs unique ID of connected user in terminal


  // 🟢 User joined
  socket.on("userJoined", (username) => {
    // Listens for "userJoined" event from client
    // Receives username sent by client

    socket.username = username;
    // Stores username inside this socket (server-side memory)
    // Useful later (like when user disconnects)

    io.emit("userJoinedMessage", username + " joined the chat");
    // Sends message to ALL connected users
    // Event name = "userJoinedMessage"
    // Data = "Ankit joined the chat"
  });


  // 💬 Message
  socket.on("sendMessage", (data) => {
    // Listens for "sendMessage" event from client
    // "data" contains message object → { user, text }

    io.emit("receiveMessage", data);
    // Broadcasts message to ALL users (including sender)
    // Clients listening to "receiveMessage" will display it
  });


  // 🔴 User left
  socket.on("disconnect", () => {
    // Built-in event → triggered automatically when user leaves
    // (tab close / refresh / network loss)

    if (socket.username) {
      // Check if username exists (user had joined properly)

      io.emit(
        "userLeftMessage",
        socket.username + " left the chat"
      );
      // Broadcast to all users that this user left
    }
  });

});


server.listen(3000, () => {
  // Starts server on port 3000

  console.log("Server running on http://localhost:3000");
  // Logs URL so you know where app is running
});
