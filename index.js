// 1. (DOM) Get the canvas element from the HTML file
const gameCanvas = document.getElementById("gameCanvas");
// 2. (Canvas) Get the 2D context from the canvas element
const ctx = gameCanvas.getContext("2d");

// 3. (Canvas) Set the canvas width and height
gameCanvas.width = 1024;
gameCanvas.height = 574;

// 4. (Canvas) Set the background color and draw the canvas
ctx.fillStyle = "white";
ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

// 5. (Canvas) Set the map image through html
const map = new Image();
map.src = "./assets/map.png";
// 6. (Canvas) Set the player image through html
const player = new Image();
player.src = "./assets/player_walk_down.png";

// 9. (Canvas) Create a class to handle the movement of the map/player images
class visual {
  constructor({ position, image }) {
    this.position = position;
    this.image = image;
  }
  move() {
    // draw the map without scaling factor for performance purposes
    ctx.drawImage(this.image, -1100, -550);
  }
}
const mapBackground = new visual({ position: { x: 0, y: 0 }, image: map });

// 7. (Canvas) Draw the map image and the player image on the canvas
// 12-08-2024 : had to use promises to load the images before drawing them on the canvas otherwise the player image was not being drawn
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
    console.log("player.png loaded successfully");
    resolve();
  };
  player.onerror = reject;
});

function play() {
  window.requestAnimationFrame(play);
  // Promise.all() will resolve when all promises are resolved
  Promise.all([mapPromise, playerPromise])
    .then(() => {
      // draw the map and scale it up
      mapBackground.move();
      // draw the player, crop the sprite and scale it up
      ctx.drawImage(
        player,
        0,
        0,
        player.width / 4,
        player.height,
        // corodinates to draw the player
        455,
        350,
        player.width * 0.75, // triple the width
        player.height * 3 // triple the height
      );
    })
    .catch(() => {
      console.error("one of the images failed to load");
    });
}
play();

// 10. (Canvas) Create an object to store the keys pressed
const keys = {
  ArrowUp: {
    pressed: false,
  },
  ArrowDown: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
};

// 8. (Canvas) Move the player image on the canvas
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "ArrowUp":
      // if i press the up arrow key, the key object will be updated
      keys.ArrowUp.pressed = true;
      break;
    case "ArrowDown":
      keys.ArrowDown.pressed = true;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      break;
    default:
      break;
  }
  // check the keys object if they are being updated
  console.log(keys);
});

// testing the canvas and the images
console.log(ctx);
console.log(player);
console.log(gameCanvas);
console.log(keys);
