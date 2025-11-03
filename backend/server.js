const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const PORT = 4000;

// ✅ Allow CORS for Express routes
app.use(cors({
  origin: "http://localhost:3000",  // your React app URL
  methods: ["GET", "POST"],
  credentials: true
}));

const server = http.createServer(app);

// ✅ Allow CORS for Socket.IO connections
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  // same React app URL
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("✅ User Connected:", socket.id);
//   io.emit("forAllMessage",`${socket.id} joined the server`)
//  socket.emit("foronlyMe",`${socket.id} joined the server`)//when i attach socket then join it 
 socket.broadcast.emit("foronlyMe",`${socket.id} joined the server`)
 //whose user join curcut live this use and add remaining users present
 //muju nahi pata chala lakin dosria user co pata chal gaya ha 
 socket.on("send-message",(data)=>{
    console.log(data)
    socket.to(data.id).emit("personal-msg",data.msg)
    // socket.emit("personal-msg",data.msg)
 })
 socket.on("join-room",(data)=>{
    socket.join(data)
 })
   socket.on("disconnect", () => {
    console.log("❌ User Disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
