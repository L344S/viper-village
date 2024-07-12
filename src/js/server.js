/*+
 * This file is the entry point for the Node.js server.
 * It uses Express.js to create a simple server that listens on port 3000.
 * A BIT SAD CUZ I WANTED TO AVOID A BACKEND BUT I GUESS I HAVE TO DO IT
 */

// Imports
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Define routes, one for each Python script
app.get("/encrypt", (req, res) => {
  const scriptPath = path.join(__dirname, "../python/encrypt.py");
  exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(`Error executing Python script: ${error}`);
      return;
    }
    if (stderr) {
      res.status(500).send(`Python stderr: ${stderr}`);
      return;
    }
    res.send(`Python stdout: ${stdout}`);
  });
});

app.get("/decrypt", (req, res) => {
  const scriptPath = path.join(__dirname, "../python/decrypt.py");
  exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(`Error executing Python script: ${error}`);
      return;
    }
    if (stderr) {
      res.status(500).send(`Python stderr: ${stderr}`);
      return;
    }
    res.send(`Python stdout: ${stdout}`);
  });
});

// Start the server, listening on port 3000
app.listen(port, "127.0.0.1", () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
