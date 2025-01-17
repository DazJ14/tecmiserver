require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const serverRoutes = require("./routes/server");
const messageRoutes = require("./routes/message");
const campusRoutes = require("./routes/testRoute")
const { protect } = require("./middlewares/authMiddleware");
const servers = require("./serversData.json")

const app = express();
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas de autenticación
app.use("/api/auth", authRoutes);

app.use("/api/campus", campusRoutes)

// Rutas de servidores y canales
app.use("/api", protect, serverRoutes);

// Rutas de mensajes
app.use("/api/messages", protect, messageRoutes);

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

let users = []

io.on("connection", (socket) => {
  const user = {
    id: socket.id,
    username: socket.handshake.query.username,
  }
  users.push(user)
  io.emit("newUser", users)

  socket.on("changeChannel", (serverId, channelId, callback) => {
    if (socket.rooms) {
      socket.rooms.forEach(room => {
        socket.leave(room)
      })
    }
    socket.join(channelId)

    const serverIndex = servers.findIndex(server => server.id === serverId)

    if (serverIndex !== -1) {
      callback(servers[serverIndex].channels[channelId].messages)
    }  
  });

  socket.on("sendMessage", ({ content, senderId, channelId, serverId }) => {
    console.log("Message received:", content, senderId, channelId, serverId);
    const payload = {
      content,
      author: senderId
    }

    socket.to(channelId).emit("newMessage", payload)

    const serverIndex = servers.findIndex(server => server.id === serverId)

    if (serverIndex === -1) return

    const serverFound = servers[serverIndex]

    if (serverFound.channels[channelId]) {
      serverFound.channels[channelId].messages.push(payload)
    }
  });

  socket.on("disconnect", () => {
    users = users.filter(user => user.id !== socket.id)
    io.emit("newUser", users)
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));