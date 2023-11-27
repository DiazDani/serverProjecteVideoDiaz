const express = require('express');
const app = express();
const cors = require('cors');
const {Server} = require("socket.io")
const io = new Server(8888)
const fs = require('fs')

app.use(cors());
app.use(express.json());
port = 3080;

app.listen(port, ()=>{
  console.log(`el port::${port} funciona`)
});

io.on('connection', (socket)=>{
  socket.emit("hello", "world")
  console.log("cliente connectado")

  let code= nouCodi()

  socket.emit('generarCodigo', this.code)


})

function nouCodi(){
  var chars = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ1234567890'
  var code= ''
  var num = 0

  for (let i = 0; i < 5; i++) {
    num= Math.floor(Math.random() * chars.length+1);
    code.concat(chars.charAt(num))
  }

  return code
}
