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


  let code

  socket.on('generarCodigo', (args)=>{
    code= nouCodi()

    console.log(code)

    socket.emit("nouCode", code)

  })

socket.on('EnviarCodiPeli', (newCode)=>{
  console.log("aaaaa")
    console.log(newCode)

    if(newCode==code){
      console.log('true')
    }else{
      console.log('false')
    }

  })



})

function nouCodi(){
  const chars = 'ABCDEFGHIJKLNMOPQRSTUVWXYZ1234567890'
  let code= ''
  let num

  for (let i = 0; i < 5; i++) {
    num= Math.floor(Math.random() * chars.length+1);
    code= code + chars.charAt(num)
  }

  return code
}
