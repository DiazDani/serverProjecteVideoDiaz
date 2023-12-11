const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const SocketIOFile = require('socket.io-file');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket', 'polling'],
  },
});

const port = 3080;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

let isFirstConnection = true;

const uploader = new SocketIOFile(io, {
  uploadDir: 'uploads',
  transmissionDelay: 0,
  overwrite: true,
});

uploader.on('start', (fileInfo) => {
  console.log('Iniciando transferencia de archivo:', fileInfo);
});

uploader.on('end', (fileInfo) => {
  console.log('Transferencia de archivo completada:', fileInfo);

  // Envía el archivo a todos los clientes conectados
  io.emit('file-received', {
    data: fs.readFileSync(fileInfo.path).toString('base64'),
    type: fileInfo.type,
  });
});

// Videos disponibles para reproducir
const videos = {
  video1: 'C:\\Users\\Pau Casas\\IdeaProjects\\ASD\\serverProjecteVideoDiaz\\src\\assets\\trailer1.mp4',
  video2: 'C:\\Users\\Pau Casas\\IdeaProjects\\ASD\\serverProjecteVideoDiaz\\src\\assets\\onepiecetrailer.mp4',
  video3: 'C:\\Users\\Pau Casas\\IdeaProjects\\ASD\\serverProjecteVideoDiaz\\src\\assets\\trailerendgame.mp4',
  video4: 'C:\\Users\\Pau Casas\\IdeaProjects\\ASD\\serverProjecteVideoDiaz\\src\\assets\\trailerpiratasdelcaribe.mp4',

};

io.on('connection', (socket) => {
  console.log('Cliente conectado');

  socket.on('play-video', (videoPath) => {
    const selectedVideoPath = videos[videoPath];
    const videoData = fs.readFileSync(selectedVideoPath).toString('base64');

    io.emit('file-received', {
      data: videoData,
      type: 'video/mp4',
    });
  });


  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
