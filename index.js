// 1. (DOM) Get the canvas element from the HTML file
const gameCanvas = document.getElementById('gameCanvas');
// 2. (Canvas) Get the 2D context from the canvas element
const ctx = gameCanvas.getContext('2d');

// 3. (Canvas) Set the canvas width and height
gameCanvas.width = 1024;
gameCanvas.height = 574;

// 4. (Canvas) Set the background color and draw the canvas
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

// 5. (Canvas) Set the map image through html 
const map = new Image();
map.src = './assets/map.png';
// 6. (Canvas) Set the player image through html
const player = new Image();
player.src = './assets/player.png';

// 7. (Canvas) Draw the map image and the player image on the canvas
// 12-08-2024 : had to use promises to load the images before drawing them on the canvas otherwise the player image was not being drawn
const scaleFactor = 3.5;
// Each promise will resolve when the image is loaded successfully
const mapPromise = new Promise((resolve, reject) => {
    map.onload = () => {
        resolve();
    };
    map.onerror = reject;
});
// Each promise will resolve when the image is loaded successfully
const playerPromise = new Promise((resolve, reject) => {
    player.onload = () => {
        console.log('player.png loaded successfully');
        resolve();
    };
    player.onerror = reject;
});
// Promise.all() will resolve when all promises are resolved
Promise.all([mapPromise, playerPromise]).then(() => {
    ctx.translate(-730, -370);
    ctx.scale(scaleFactor, scaleFactor);
    ctx.drawImage(map, 0, 0, gameCanvas.width, gameCanvas.height);
    ctx.drawImage(player, gameCanvas.width / (2 * scaleFactor), gameCanvas.height / (2 * scaleFactor));
}).catch(() => {
    console.error('one of the images failed to load');
});

// testing the canvas and the images
console.log(ctx);
console.log(player);
console.log(gameCanvas);