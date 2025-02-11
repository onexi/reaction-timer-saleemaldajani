// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app and HTTP server.
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Variables to store the fastest reaction data and all attempts.
let fastestReactionTime = Infinity;
let fastestUser = null;
const attempts = []; // Array of objects: { name, reactionTime }

// Serve static files from the "public" directory.
app.use(express.static('public'));

// Listen for new client connections.
io.on('connection', (socket) => {
  console.log('New client connected: ' + socket.id);
  // Initially, the userName is null.
  socket.userName = null;

  // Listen for the client's "setName" event.
  socket.on('setName', (data) => {
    socket.userName = data.name || socket.id;
    console.log(`User set name to: ${socket.userName}`);
    socket.emit('welcome', { user: socket.userName });
  });

  // Listen for the "start" event to begin a round.
  socket.on('start', () => {
    if (!socket.userName) {
      socket.emit('errorMessage', { message: 'Please set your name first!' });
      return;
    }
    console.log(`${socket.userName} requested a new round.`);
    // Compute a random delay between 1 and 20 seconds.
    const delay = Math.floor(Math.random() * 19000) + 1000; // [1000, 20000] ms
    console.log(`Random delay for ${socket.userName}: ${delay} ms`);

    // After the delay, send the "go" signal.
    setTimeout(() => {
      const goTime = Date.now();
      // Save the go time on the socket object.
      socket.goTime = goTime;
      socket.emit('go', { goTime });
      console.log(`Sent GO signal to ${socket.userName} at ${goTime}`);
    }, delay);
  });

  // Listen for a click event from the client.
  socket.on('click', () => {
    // If the click comes before the "go" signal, reject it.
    if (!socket.goTime) {
      console.log(`${socket.userName || socket.id} clicked too early.`);
      socket.emit('errorMessage', { message: 'Too early! Wait for the signal.' });
      return;
    }
    // Compute the reaction time.
    const clickTime = Date.now();
    const reactionTime = clickTime - socket.goTime;
    console.log(`${socket.userName} reacted in ${reactionTime} ms`);

    // Send the reaction time result back to the client.
    socket.emit('result', { reactionTime, user: socket.userName });

    // Record the attempt.
    attempts.push({ name: socket.userName, reactionTime });

    // Broadcast the updated attempts list to all clients.
    io.emit('updateAttempts', { attempts });

    // Update the fastest reaction time if needed.
    if (reactionTime < fastestReactionTime) {
      fastestReactionTime = reactionTime;
      fastestUser = socket.userName;
      // Broadcast the new fastest reaction to all connected clients.
      io.emit('newFastest', { fastestReactionTime, fastestUser });
      console.log(`New fastest: ${reactionTime} ms by ${socket.userName}`);
    }

    // Clear the goTime so that multiple clicks in one round are ignored.
    socket.goTime = null;
  });

  // Handle client disconnect.
  socket.on('disconnect', () => {
    console.log('Client disconnected: ' + socket.id);
  });
});

// Start the server.
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
