const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // 🟢 User joined
  socket.on("userJoined", (username) => {
    socket.username = username;

    io.emit("userJoinedMessage", username + " joined the chat");
  });

  // 💬 Message
  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  // 🔴 User left
  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit(
        "userLeftMessage",
        socket.username + " left the chat"
      );
    }
  });
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});