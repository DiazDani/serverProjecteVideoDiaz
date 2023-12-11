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

// Ruta al archivo de contraseñas
const passwordsPath = path.join(__dirname, 'assets', 'contraseñas.txt');

let passwords = {};

// Lee las contraseñas del archivo y almacénalas en el objeto 'passwords'
function getPasswords() {
  const passwordsFile = fs.readFileSync(passwordsPath, 'utf8');
  const passwordLines = passwordsFile.split('\n');

  passwordLines.forEach((line) => {
    const [video, password] = line.split(':');
    passwords[video.trim()] = password.trim();
  });
}

// Esta función verifica si la contraseña proporcionada es correcta para el video especificado
function validatePassword(video, enteredPassword) {
  return passwords[video] === enteredPassword;
}

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

  io.emit('file-received', {
    data: fs.readFileSync(fileInfo.path).toString('base64'),
    type: fileInfo.type,
  });
});

// Videos disponibles para reproducir
const videos = {
  video1: 'C:\\Users\\Joan Casas\\IdeaProjects\\serverProjecteVideoDiaz\\src\\assets\\trailer1.mp4',
  video2: 'C:\\Users\\Joan Casas\\IdeaProjects\\serverProjecteVideoDiaz\\src\\assets\\onepiecetrailer.mp4',
  video3: 'C:\\Users\\Joan Casas\\IdeaProjects\\serverProjecteVideoDiaz\\src\\assets\\trailerendgame.mp4',
  video4: 'C:\\Users\\Joan Casas\\IdeaProjects\\serverProjecteVideoDiaz\\src\\assets\\trailerpiratasdelcaribe.mp4',
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

  socket.emit('hello', 'world');
  console.log('cliente conectado');

  socket.emit('listaVideos', videos);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
