// Express SetUp
const express = require('express');//Express
const app = express();//Use Express
const path = require('path');//Path
const http =require('http'); // HTTP

const port = 3000 //Port Set

// Socket.io Setup
const socketio =require('socket.io'); // SOcket IO
const server=http.createServer(app); // Create Server
const io=socketio(server); // Calliing SOcket.io to Connect Server and Socket io

// ejs Setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,"public")));



// Socket io Connection Establish
io.on('connection', (socket) => {
    // Now Accept the "send-location" emit From Backend
    socket.on("send-location",(data)=>{
    // As we(backend) recieved User Location so we emit to All Users that we recieved
    io.emit("receive-location",{id:socket.id,...data}) // ...data spread Operator
    });
    // User Disconnect
    socket.on("disconnect",()=>{
        io.emit("user-disconnected",socket.id);
    })
  });


// Routes
// Get Requests
app.get('/', (req, res) => {
    res.render('index');
})
app.get('/home', (req, res) => {
    res.render('home');
})
app.get('/contact', (req, res) => {
    res.render('contact');
})

server.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})

