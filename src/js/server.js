/*+
 * This file is the entry point for the Node.js server.
 * It uses Express.js to create a simple server that listens on port 3000.
 * A BIT SAD CUZ I WANTED TO AVOID A BACKEND BUT I GUESS I HAVE TO DO IT
 */
const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const app = express();
const port = 3000;

app.use(cors());

app.get("/encrypt", (req, res) => {
  console.log("The request to /encrypt has been received");
  const scriptPath = path.join(__dirname, "../python/encrypt.py");
  exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      res.status(500).send(`Error executing Python script: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Python stderr: ${stderr}`);
      res.status(500).send(`Python stderr: ${stderr}`);
      return;
    }
    console.log(`Python stdout: ${stdout}`);
    res.send(`Python stdout: ${stdout}`);
  });
});

app.get("/decrypt", (req, res) => {
  console.log("The request to /decrypt has been received");
  const scriptPath = path.join(__dirname, "../python/decrypt.py");
  exec(`python3 ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      res.status(500).send(`Error executing Python script: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`Python stderr: ${stderr}`);
      res.status(500).send(`Python stderr: ${stderr}`);
      return;
    }
    console.log(`Python stdout: ${stdout}`);
    res.send(`Python stdout: ${stdout}`);
  });
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
});
