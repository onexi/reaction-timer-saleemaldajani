// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Create an Express app and HTTP server.
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Variables to store the fastest reaction data.
let fastestReactionTime = Infinity;
let fastestUser = null;

// Serve static files from the "public" directory.
app.use(express.static('public'));

// Listen for new client connections.
io.on('connection', (socket) => {
  console.log('New client connected: ' + socket.id);

  // Use the socket ID as the user name (or you can prompt the user for one).
  let userName = socket.id;

  // Send a welcome message with the user’s ID.
  socket.emit('welcome', { user: userName });

  // Listen for the client’s "start" event to begin a round.
  socket.on('start', () => {
    console.log(`${userName} requested a new round.`);
    // Compute a random delay between 1 and 20 seconds.
    const delay = Math.floor(Math.random() * 19000) + 1000; // [1000, 20000] ms
    console.log(`Random delay for ${userName}: ${delay} ms`);

    // After the delay, send the "go" signal.
    setTimeout(() => {
      const goTime = Date.now();
      // Save the go time on the socket object.
      socket.goTime = goTime;
      socket.emit('go', { goTime });
      console.log(`Sent GO signal to ${userName} at ${goTime}`);
    }, delay);
  });

  // Listen for a click event from the client.
  socket.on('click', () => {
    // If the click comes before the "go" signal, reject it.
    if (!socket.goTime) {
      console.log(`${userName} clicked too early.`);
      socket.emit('errorMessage', { message: 'Too early! Wait for the signal.' });
      return;
    }
    // Compute the reaction time.
    const clickTime = Date.now();
    const reactionTime = clickTime - socket.goTime;
    console.log(`${userName} reacted in ${reactionTime} ms`);

    // Send the result back to the client.
    socket.emit('result', { reactionTime, user: userName });

    // Update the fastest reaction if needed.
    if (reactionTime < fastestReactionTime) {
      fastestReactionTime = reactionTime;
      fastestUser = userName;
      // Broadcast the new fastest reaction to all connected clients.
      io.emit('newFastest', { fastestReactionTime, fastestUser });
      console.log(`New fastest: ${reactionTime} ms by ${userName}`);
    }

    // Clear the goTime so multiple clicks in one round are ignored.
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
