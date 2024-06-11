// 1. (DOM) Get the canvas element from the HTML file
const gameCanvas = document.getElementById('gameCanvas');
// 2. (Canvas) Get the 2D context from the canvas element
const ctx = gameCanvas.getContext('2d');

// 3. (Canvas) Set the canvas width and height
gameCanvas.width = 1024;
gameCanvas.height = 574;


// testing the canvas and context
console.log(ctx);
console.log(gameCanvas);