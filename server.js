const express = require("express");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");

const app = express();
const port = 3000;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));

let availableSplatFilenames = [];

// Function to retrieve filenames from /public/gaussian-splats
function getFilenamesFromDirectory() {
  const directoryPath = path.join(__dirname, "public", "gaussian-splats");
  const filenames = fs.readdirSync(directoryPath);
  console.log({ filenames });
  return filenames;
}

// Call the function every 30 seconds and save filenames to global variable
availableSplatFilenames = getFilenamesFromDirectory();
setInterval(() => {
  availableSplatFilenames = getFilenamesFromDirectory();
}, 30000);

// Create an HTTP server
const httpServer = http.createServer(app);

// Create a socket.io server
const io = new Server(httpServer);

// Handle socket.io connections
io.on("connection", (socket) => {
  socket.emit("availableSplatFilenames", availableSplatFilenames);
  console.log("A client connected");

  // Handle events from the client
  socket.on("event", (data) => {
    console.log("Received event:", data);
    // Handle the event logic here
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

// Start the server
httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
