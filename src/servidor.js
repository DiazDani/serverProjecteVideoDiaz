const express = require('express');
const app = express();
const cors = require('cors');
const {Server} = require("socket.io")
const io = new Server(8888)
const fs = require('fs')
const path = require('path');


app.use(cors());
app.use(express.json());
port = 3080;


app.use(express.static('assets'));

const videos = [
  { name: 'Avatar 2', path: __dirname + '/assets/Avatar 2.mp4', valid: false },
  { name: 'Guardianes de la galaxia vol 3', path: __dirname + '/assets/Guardianes de la galaxia vol 3.mp4', valid: false },
  { name: 'OPPENHEIMER', path: __dirname + '/assets/OPPENHEIMER.mp4', valid: false },
  { name: 'Five Nights At Freddy\'s', path: __dirname + '/assets/Five Nights At Freddys.mp4', valid: false },
]

app.listen(port, () => {
  console.log(`el port::${port} funciona`)
});

let code
io.on('connection', (socket) => {
  socket.emit("hello", "world")
  console.log("cliente connectado")

  socket.emit('listaVideos', videos);

  socket.on('generarCodigo', (args) => {
    code = nouCodi();
    console.log(code);
    socket.join(code); // Unir a la sala con el código generado
    socket.emit("nouCode", code);
  })

  socket.on('EnviarCodiPeli', (clientCode) => {


    console.log(clientCode);
    if (clientCode === code) {
      io.to(code).emit("codigoCorrecto", true);
    } else {
      io.to(code).emit("codigoCorrecto", false);
    }

  })


})

function nouCodi() {
  const chars = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ1234567890'
  let code = ""
  let num

  for (let i = 0; i < 5; i++) {
    num = Math.floor(Math.random() * chars.length + 1);
    code = code + chars.charAt(num)
  }

  return code
}
