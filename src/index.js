// Constants
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 160; // 160 usually but it's too slow for testing
const FRAMERATE = 9;

// TEMPORARY: Set the collision coordinates
// i'm lazy just dont want to link the data file for now
const setCollision = new Set();
setCollision.add(`2928,480`);
setCollision.add(`2976,480`);
setCollision.add(`3024,480`);
setCollision.add(`3360,480`);
setCollision.add(`3408,480`);
setCollision.add(`3552,480`);
setCollision.add(`2880,528`);
setCollision.add(`3072,528`);
setCollision.add(`3312,528`);
setCollision.add(`3408,528`);
setCollision.add(`3552,528`);
setCollision.add(`768,576`);
setCollision.add(`816,576`);
setCollision.add(`960,576`);
setCollision.add(`1008,576`);
setCollision.add(`2832,576`);
setCollision.add(`2880,576`);
setCollision.add(`3120,576`);
setCollision.add(`3312,576`);
setCollision.add(`3408,576`);
setCollision.add(`3456,576`);
setCollision.add(`3504,576`);
setCollision.add(`3552,576`);
setCollision.add(`768,624`);
setCollision.add(`864,624`);
setCollision.add(`912,624`);
setCollision.add(`1056,624`);
setCollision.add(`1104,624`);
setCollision.add(`1872,624`);
setCollision.add(`2736,624`);
setCollision.add(`2784,624`);
setCollision.add(`3120,624`);
setCollision.add(`3312,624`);
setCollision.add(`3600,624`);
setCollision.add(`720,672`);
setCollision.add(`768,672`);
setCollision.add(`1152,672`);
setCollision.add(`1200,672`);
setCollision.add(`1248,672`);
setCollision.add(`1296,672`);
setCollision.add(`1344,672`);
setCollision.add(`1584,672`);
setCollision.add(`1632,672`);
setCollision.add(`1680,672`);
setCollision.add(`1824,672`);
setCollision.add(`1920,672`);
setCollision.add(`2688,672`);
setCollision.add(`2784,672`);
setCollision.add(`3120,672`);
setCollision.add(`3168,672`);
setCollision.add(`3216,672`);
setCollision.add(`3264,672`);
setCollision.add(`3312,672`);
setCollision.add(`3600,672`);
setCollision.add(`576,720`);
setCollision.add(`624,720`);
setCollision.add(`672,720`);
setCollision.add(`1344,720`);
setCollision.add(`1584,720`);
setCollision.add(`1680,720`);
setCollision.add(`1824,720`);
setCollision.add(`1920,720`);
setCollision.add(`2496,720`);
setCollision.add(`2544,720`);
setCollision.add(`2592,720`);
setCollision.add(`2640,720`);
setCollision.add(`2688,720`);
setCollision.add(`2784,720`);
setCollision.add(`3600,720`);
setCollision.add(`576,768`);
setCollision.add(`1344,768`);
setCollision.add(`1392,768`);
setCollision.add(`1440,768`);
setCollision.add(`1488,768`);
setCollision.add(`1536,768`);
setCollision.add(`1584,768`);
setCollision.add(`1680,768`);
setCollision.add(`1728,768`);
setCollision.add(`1776,768`);
setCollision.add(`1824,768`);
setCollision.add(`1920,768`);
setCollision.add(`2448,768`);
setCollision.add(`2832,768`);
setCollision.add(`2880,768`);
setCollision.add(`2928,768`);
setCollision.add(`2976,768`);
setCollision.add(`3600,768`);
setCollision.add(`3648,768`);
setCollision.add(`3696,768`);
setCollision.add(`576,816`);
setCollision.add(`720,816`);
setCollision.add(`768,816`);
setCollision.add(`816,816`);
setCollision.add(`864,816`);
setCollision.add(`912,816`);
setCollision.add(`960,816`);
setCollision.add(`1008,816`);
setCollision.add(`1056,816`);
setCollision.add(`1104,816`);
setCollision.add(`1920,816`);
setCollision.add(`1968,816`);
setCollision.add(`2016,816`);
setCollision.add(`2064,816`);
setCollision.add(`2112,816`);
setCollision.add(`2160,816`);
setCollision.add(`2208,816`);
setCollision.add(`2256,816`);
setCollision.add(`2304,816`);
setCollision.add(`2352,816`);
setCollision.add(`2400,816`);
setCollision.add(`2448,816`);
setCollision.add(`2880,816`);
setCollision.add(`2976,816`);
setCollision.add(`3024,816`);
setCollision.add(`3072,816`);
setCollision.add(`3600,816`);
setCollision.add(`3696,816`);
setCollision.add(`576,864`);
setCollision.add(`720,864`);
setCollision.add(`1104,864`);
setCollision.add(`1344,864`);
setCollision.add(`1584,864`);
setCollision.add(`2880,864`);
setCollision.add(`3024,864`);
setCollision.add(`3120,864`);
setCollision.add(`3168,864`);
setCollision.add(`3216,864`);
setCollision.add(`3312,864`);
setCollision.add(`3360,864`);
setCollision.add(`3504,864`);
setCollision.add(`3552,864`);
setCollision.add(`3696,864`);
setCollision.add(`576,912`);
setCollision.add(`720,912`);
setCollision.add(`1104,912`);
setCollision.add(`2160,912`);
setCollision.add(`2208,912`);
setCollision.add(`2256,912`);
setCollision.add(`2304,912`);
setCollision.add(`2352,912`);
setCollision.add(`2400,912`);
setCollision.add(`2880,912`);
setCollision.add(`2928,912`);
setCollision.add(`2976,912`);
setCollision.add(`3024,912`);
setCollision.add(`3264,912`);
setCollision.add(`3696,912`);
setCollision.add(`3744,912`);
setCollision.add(`3792,912`);
setCollision.add(`3840,912`);
setCollision.add(`576,960`);
setCollision.add(`720,960`);
setCollision.add(`1104,960`);
setCollision.add(`3840,960`);
setCollision.add(`576,1008`);
setCollision.add(`720,1008`);
setCollision.add(`768,1008`);
setCollision.add(`816,1008`);
setCollision.add(`864,1008`);
setCollision.add(`912,1008`);
setCollision.add(`960,1008`);
setCollision.add(`1008,1008`);
setCollision.add(`1056,1008`);
setCollision.add(`1104,1008`);
setCollision.add(`3840,1008`);
setCollision.add(`576,1056`);
setCollision.add(`3696,1056`);
setCollision.add(`3744,1056`);
setCollision.add(`3792,1056`);
setCollision.add(`3840,1056`);
setCollision.add(`576,1104`);
setCollision.add(`1488,1104`);
setCollision.add(`1536,1104`);
setCollision.add(`1728,1104`);
setCollision.add(`1776,1104`);
setCollision.add(`1824,1104`);
setCollision.add(`1872,1104`);
setCollision.add(`1920,1104`);
setCollision.add(`2208,1104`);
setCollision.add(`2256,1104`);
setCollision.add(`2304,1104`);
setCollision.add(`2352,1104`);
setCollision.add(`2400,1104`);
setCollision.add(`2448,1104`);
setCollision.add(`2496,1104`);
setCollision.add(`2544,1104`);
setCollision.add(`2592,1104`);
setCollision.add(`2640,1104`);
setCollision.add(`2688,1104`);
setCollision.add(`2736,1104`);
setCollision.add(`2784,1104`);
setCollision.add(`2832,1104`);
setCollision.add(`2880,1104`);
setCollision.add(`2928,1104`);
setCollision.add(`2976,1104`);
setCollision.add(`3024,1104`);
setCollision.add(`3072,1104`);
setCollision.add(`3120,1104`);
setCollision.add(`3168,1104`);
setCollision.add(`3216,1104`);
setCollision.add(`3264,1104`);
setCollision.add(`3312,1104`);
setCollision.add(`3360,1104`);
setCollision.add(`3696,1104`);
setCollision.add(`576,1152`);
setCollision.add(`624,1152`);
setCollision.add(`672,1152`);
setCollision.add(`720,1152`);
setCollision.add(`768,1152`);
setCollision.add(`816,1152`);
setCollision.add(`1536,1152`);
setCollision.add(`1584,1152`);
setCollision.add(`1728,1152`);
setCollision.add(`1920,1152`);
setCollision.add(`2208,1152`);
setCollision.add(`2448,1152`);
setCollision.add(`3408,1152`);
setCollision.add(`3648,1152`);
setCollision.add(`3696,1152`);
setCollision.add(`816,1200`);
setCollision.add(`1536,1200`);
setCollision.add(`1728,1200`);
setCollision.add(`1776,1200`);
setCollision.add(`1824,1200`);
setCollision.add(`1872,1200`);
setCollision.add(`1920,1200`);
setCollision.add(`2256,1200`);
setCollision.add(`2304,1200`);
setCollision.add(`2352,1200`);
setCollision.add(`2400,1200`);
setCollision.add(`2496,1200`);
setCollision.add(`2544,1200`);
setCollision.add(`2592,1200`);
setCollision.add(`3408,1200`);
setCollision.add(`3648,1200`);
setCollision.add(`3696,1200`);
setCollision.add(`864,1248`);
setCollision.add(`1248,1248`);
setCollision.add(`1296,1248`);
setCollision.add(`1344,1248`);
setCollision.add(`1392,1248`);
setCollision.add(`1440,1248`);
setCollision.add(`1488,1248`);
setCollision.add(`2592,1248`);
setCollision.add(`2640,1248`);
setCollision.add(`2688,1248`);
setCollision.add(`3360,1248`);
setCollision.add(`3648,1248`);
setCollision.add(`3696,1248`);
setCollision.add(`864,1296`);
setCollision.add(`1248,1296`);
setCollision.add(`1536,1296`);
setCollision.add(`1584,1296`);
setCollision.add(`1632,1296`);
setCollision.add(`1680,1296`);
setCollision.add(`1968,1296`);
setCollision.add(`2016,1296`);
setCollision.add(`2064,1296`);
setCollision.add(`2160,1296`);
setCollision.add(`2208,1296`);
setCollision.add(`2256,1296`);
setCollision.add(`2352,1296`);
setCollision.add(`2400,1296`);
setCollision.add(`2448,1296`);
setCollision.add(`2688,1296`);
setCollision.add(`3360,1296`);
setCollision.add(`3696,1296`);
setCollision.add(`864,1344`);
setCollision.add(`1248,1344`);
setCollision.add(`1680,1344`);
setCollision.add(`2688,1344`);
setCollision.add(`3360,1344`);
setCollision.add(`3696,1344`);
setCollision.add(`816,1392`);
setCollision.add(`1248,1392`);
setCollision.add(`1680,1392`);
setCollision.add(`1920,1392`);
setCollision.add(`1968,1392`);
setCollision.add(`2016,1392`);
setCollision.add(`2064,1392`);
setCollision.add(`2112,1392`);
setCollision.add(`2160,1392`);
setCollision.add(`2208,1392`);
setCollision.add(`2256,1392`);
setCollision.add(`2304,1392`);
setCollision.add(`2352,1392`);
setCollision.add(`2400,1392`);
setCollision.add(`2448,1392`);
setCollision.add(`2496,1392`);
setCollision.add(`2544,1392`);
setCollision.add(`2688,1392`);
setCollision.add(`3360,1392`);
setCollision.add(`3648,1392`);
setCollision.add(`3696,1392`);
setCollision.add(`816,1440`);
setCollision.add(`1248,1440`);
setCollision.add(`1680,1440`);
setCollision.add(`1920,1440`);
setCollision.add(`2544,1440`);
setCollision.add(`2688,1440`);
setCollision.add(`3360,1440`);
setCollision.add(`3648,1440`);
setCollision.add(`3696,1440`);
setCollision.add(`816,1488`);
setCollision.add(`1248,1488`);
setCollision.add(`1680,1488`);
setCollision.add(`1920,1488`);
setCollision.add(`2544,1488`);
setCollision.add(`2688,1488`);
setCollision.add(`3312,1488`);
setCollision.add(`3360,1488`);
setCollision.add(`3648,1488`);
setCollision.add(`3696,1488`);
setCollision.add(`816,1536`);
setCollision.add(`1248,1536`);
setCollision.add(`1536,1536`);
setCollision.add(`1584,1536`);
setCollision.add(`1632,1536`);
setCollision.add(`1680,1536`);
setCollision.add(`1920,1536`);
setCollision.add(`2544,1536`);
setCollision.add(`2688,1536`);
setCollision.add(`3312,1536`);
setCollision.add(`3696,1536`);
setCollision.add(`816,1584`);
setCollision.add(`1248,1584`);
setCollision.add(`1440,1584`);
setCollision.add(`1488,1584`);
setCollision.add(`1920,1584`);
setCollision.add(`2544,1584`);
setCollision.add(`2688,1584`);
setCollision.add(`3312,1584`);
setCollision.add(`3696,1584`);
setCollision.add(`864,1632`);
setCollision.add(`912,1632`);
setCollision.add(`1248,1632`);
setCollision.add(`1296,1632`);
setCollision.add(`1345,1632`);
setCollision.add(`1392,1585`);
setCollision.add(`1488,1632`);
setCollision.add(`1920,1632`);
setCollision.add(`2544,1632`);
setCollision.add(`2688,1632`);
setCollision.add(`2736,1632`);
setCollision.add(`2784,1632`);
setCollision.add(`2832,1632`);
setCollision.add(`2880,1632`);
setCollision.add(`2928,1632`);
setCollision.add(`2976,1632`);
setCollision.add(`3024,1632`);
setCollision.add(`3072,1632`);
setCollision.add(`3120,1632`);
setCollision.add(`3168,1632`);
setCollision.add(`3216,1632`);
setCollision.add(`3264,1632`);
setCollision.add(`3312,1632`);
setCollision.add(`3552,1632`);
setCollision.add(`3600,1632`);
setCollision.add(`3696,1632`);
setCollision.add(`912,1680`);
setCollision.add(`1920,1680`);
setCollision.add(`2544,1680`);
setCollision.add(`3552,1680`);
setCollision.add(`3600,1680`);
setCollision.add(`3648,1680`);
setCollision.add(`3696,1680`);
setCollision.add(`720,1728`);
setCollision.add(`768,1728`);
setCollision.add(`816,1728`);
setCollision.add(`864,1728`);
setCollision.add(`912,1728`);
setCollision.add(`1920,1728`);
setCollision.add(`1968,1728`);
setCollision.add(`2016,1728`);
setCollision.add(`2064,1728`);
setCollision.add(`2112,1728`);
setCollision.add(`2160,1728`);
setCollision.add(`2208,1728`);
setCollision.add(`2256,1728`);
setCollision.add(`2304,1728`);
setCollision.add(`2352,1728`);
setCollision.add(`2400,1728`);
setCollision.add(`2448,1728`);
setCollision.add(`2496,1728`);
setCollision.add(`3600,1728`);
setCollision.add(`3648,1728`);
setCollision.add(`3696,1728`);
setCollision.add(`672,1776`);
setCollision.add(`3696,1776`);
setCollision.add(`672,1824`);
setCollision.add(`720,1824`);
setCollision.add(`768,1824`);
setCollision.add(`816,1824`);
setCollision.add(`864,1824`);
setCollision.add(`912,1824`);
setCollision.add(`960,1824`);
setCollision.add(`1008,1824`);
setCollision.add(`1056,1824`);
setCollision.add(`1104,1824`);
setCollision.add(`1152,1824`);
setCollision.add(`1200,1824`);
setCollision.add(`1248,1824`);
setCollision.add(`1296,1824`);
setCollision.add(`1344,1824`);
setCollision.add(`1392,1824`);
setCollision.add(`1440,1824`);
setCollision.add(`1584,1824`);
setCollision.add(`1632,1824`);
setCollision.add(`1680,1824`);
setCollision.add(`1728,1824`);
setCollision.add(`1776,1824`);
setCollision.add(`2016,1824`);
setCollision.add(`2064,1824`);
setCollision.add(`2112,1824`);
setCollision.add(`2496,1824`);
setCollision.add(`2544,1824`);
setCollision.add(`2592,1824`);
setCollision.add(`2640,1824`);
setCollision.add(`2688,1824`);
setCollision.add(`2736,1824`);
setCollision.add(`2784,1824`);
setCollision.add(`2832,1824`);
setCollision.add(`2880,1824`);
setCollision.add(`2928,1824`);
setCollision.add(`2976,1824`);
setCollision.add(`3024,1824`);
setCollision.add(`3072,1824`);
setCollision.add(`3120,1824`);
setCollision.add(`3168,1824`);
setCollision.add(`3216,1824`);
setCollision.add(`3264,1824`);
setCollision.add(`3312,1824`);
setCollision.add(`3360,1824`);
setCollision.add(`3408,1824`);
setCollision.add(`3456,1824`);
setCollision.add(`3504,1824`);
setCollision.add(`3552,1824`);
setCollision.add(`3600,1824`);
setCollision.add(`3648,1824`);
setCollision.add(`3696,1824`);
setCollision.add(`1440,1872`);
setCollision.add(`1584,1872`);
setCollision.add(`1824,1872`);
setCollision.add(`1872,1872`);
setCollision.add(`1920,1872`);
setCollision.add(`1968,1872`);
setCollision.add(`2160,1872`);
setCollision.add(`2208,1872`);
setCollision.add(`2256,1872`);
setCollision.add(`2352,1872`);
setCollision.add(`2400,1872`);
setCollision.add(`2448,1872`);
setCollision.add(`1440,1920`);
setCollision.add(`1584,1920`);
setCollision.add(`2304,1920`);
setCollision.add(`1440,1968`);
setCollision.add(`1488,1968`);
setCollision.add(`1536,1968`);
setCollision.add(`1584,1968`);

// Phaser 3 : Configuration the game performance settings
const config = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  render: {
    pixelArt: true,
    contextAttributes: {
      // tried to handle chrome's performance issues
      willReadFrequently: true,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
    createPlayerAnimation: createPlayerAnimation,
  },
};

// Create the game instance and initialize player and cursors variables
const game = new Phaser.Game(config);
let player;
let cursors;
let wasd;
// let graphics; testing temporary hitbox

function preload() {
  // Load the map and all the player assets
  this.load.image("map", "../assets/map.png");
  this.load.spritesheet("player", "../assets/player.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.spritesheet("player_down", "../assets/player_walk_down.png", {
    frameWidth: 30,
    frameHeight: 30,
  });
  this.load.spritesheet("player_up", "../assets/player_walk_up.png", {
    frameWidth: 30,
    frameHeight: 29,
  });
  this.load.spritesheet("player_left", "../assets/player_walk_left.png", {
    frameWidth: 30,
    frameHeight: 30,
  });
  this.load.spritesheet("player_right", "../assets/player_walk_right.png", {
    frameWidth: 30,
    frameHeight: 30,
  });
}

function create() {
  // Draw the map, set the dimensions and scale (0.9 to fit the screen)
  this.add.image(1140, 740, "map").setScale(0.938); // NEVER TOUCH THIS LINE
  // Draw the player, set the player's spawn position and scale (3 to adapt the player's size)
  player = this.physics.add.sprite(470, 380, "player").setScale(3);
  // fix the player's hitbox cuz it's too big with the collision
  player.body
    .setSize(player.width - 10, player.height - 40, false)
    .setOffset(0, 10);

  //graphics = this.add.graphics(); // testing the border and hitbox

  // Call the function to create the player animations for each direction
  createPlayerAnimation("down", this);
  createPlayerAnimation("up", this);
  createPlayerAnimation("left", this);
  createPlayerAnimation("right", this);
  // Set the collision for the player and the red blocks (temporary red, will be invisible later)
  setCollision.forEach((coords) => {
    // going through the set of collision coordinates
    const [x, y] = coords.split(",").map(Number);
    let colBlock = this.add
      .rectangle(x, y, 43, 43, 0x000000, 0)
      .setOrigin(23.6, 11.2)
      .setScale(1);

    this.physics.add.existing(colBlock);
    colBlock.body.immovable = true;
    this.physics.add.collider(player, colBlock); // set the collision between the player and walls
  });
  // Set the variables to handle the keyboard inputs (arrow keys and WASD keys)
  cursors = this.input.keyboard.createCursorKeys();
  wasd = this.input.keyboard.addKeys({
    up: Phaser.Input.Keyboard.KeyCodes.W,
    down: Phaser.Input.Keyboard.KeyCodes.S,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  });
  // Set the camera to follow the player and set the limits
  this.cameras.main.startFollow(player);
  this.cameras.main.setBounds(-800, -800, 5000, 3500);
}

/*
function drawBorder() {
  // test function to draw the border of the player's hitbox to adjust it (only for testing)
  graphics.clear();
  graphics.lineStyle(2, 0x00ff00, 1);

  graphics.strokeRect(
    player.x - (player.width - 10) / 2,
    player.y - (player.height - 40) / 2,
    player.width - 10,
    player.height - 40
  );
}
*/

// Create the player animations for each direction
function createPlayerAnimation(direction, scene) {
  scene.anims.create({
    key: direction,
    frames: scene.anims.generateFrameNumbers(`player_${direction}`, {
      start: 0,
      end: 3,
    }),
    frameRate: FRAMERATE,
    repeat: -1,
  });
}

// Update the player's movement based on the keyboard inputs
function update() {
  player.setVelocity(0);
  // drawBorder();
  if (cursors.left.isDown || wasd.left.isDown) {
    player.setVelocityX(-PLAYER_SPEED);
    player.anims.play("left", true);
  } else if (cursors.right.isDown || wasd.right.isDown) {
    player.setVelocityX(PLAYER_SPEED);
    player.anims.play("right", true);
  } else if (cursors.up.isDown || wasd.up.isDown) {
    player.setVelocityY(-PLAYER_SPEED);
    player.anims.play("up", true);
  } else if (cursors.down.isDown || wasd.down.isDown) {
    player.setVelocityY(PLAYER_SPEED);
    player.anims.play("down", true);
  } else {
    player.anims.stop();
  }
  //console.log(`Position du joueur - x: ${player.x}, y: ${player.y}`);
}
