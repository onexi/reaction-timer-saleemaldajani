# Reaction Timer App  

A simple reaction timer application built with Node.js, Express, and Socket.IO. This app allows users to test their reaction times, record their scores along with their names, and see a live-updated list of all attempts. It also highlights the fastest reaction time among all users.  

## Features  

- **User Identification:**  
  Users can enter their name before starting a round.  

- **Fair Timing Mechanism:**  
  The server controls the timing by waiting a random delay (between 1 and 20 seconds) before sending a "go" signal. Reaction times are calculated on the server, preventing client-side cheating.  

- **Real-Time Updates:**  
  Each reaction time is recorded and broadcast to all connected users. The fastest reaction time is updated live as new attempts are made.  

- **Simple and Intuitive UI:**  
  The interface includes a timer button, a list of all reaction attempts, and a display for the fastest reaction record.  

## Prerequisites  

- [Node.js](https://nodejs.org/) (v14 or later is recommended)  
- [npm](https://www.npmjs.com/) (comes with Node.js)  

## Installation  

1. **Clone the Repository:**  
   ```sh
   git clone https://github.com/onexi/reaction-timer-saleemaldajani.git
   ```
   
2. **Change into the Project Directory:**  
   ```sh
   cd reaction-timer-saleemaldajani
   ```

3. **Initialize the Project (if needed):**  
   If there is no `package.json` file yet, initialize it with:  
   ```sh
   npm init -y
   ```

4. **Install Dependencies:**  
   ```sh
   npm install express socket.io
   ```

## Running the App  

1. **Start the Server:**  
   ```sh
   node server.js
   ```
   The server will start on port 3000 (or on the port specified in your environment variable `PORT`).  

2. **Open the App in Your Browser:**  
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access the reaction timer interface.  

## How to Use  

1. **Set Your Name:**  
   Enter your name in the provided input field and click the "Set Name" button. This will register your name with the server.  

2. **Start a Round:**  
   Once your name is set, click the "Start Round" button to initiate a new round. The app will wait a random period (between 1 and 20 seconds) before sending a signal.  

3. **React to the Signal:**  
   When the timer button changes from green ("Wait...") to red ("Click!"), click the button as fast as you can. Your reaction time will be calculated by the server and displayed on the page.  

4. **View Results:**  
   - Your reaction time is displayed below the timer button.  
   - A live-updated list shows all reaction attempts from every user.  
   - The fastest reaction time, along with the name of the user who achieved it, is updated in real-time.  

## File Structure  

- **server.js**  
  Contains the server code which uses Express to serve static files and Socket.IO for real-time communication.  

- **public/index.html**  
  The client-side HTML file, which includes the user interface and JavaScript code to interact with the server.  

## Technologies Used  

- **Node.js** – JavaScript runtime environment.  
- **Express** – Web framework for Node.js.  
- **Socket.IO** – Library for real-time, bi-directional communication between web clients and servers.  
- **HTML/CSS/JavaScript** – For building the client-side interface.  

## License  

This project is licensed under the MIT License.  

Happy coding and have fun testing your reaction times!  
