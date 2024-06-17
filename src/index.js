// Constants
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 160;
const FRAMERATE = 9;

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
  this.add.image(1120, 740, "map").setScale(0.9);
  // Draw the player, set the player's spawn position and scale (3 to adapt the player's size)
  player = this.physics.add.sprite(470, 380, "player").setScale(3);

  // Call the function to create the player animations for each direction
  createPlayerAnimation("down", this);
  createPlayerAnimation("up", this);
  createPlayerAnimation("left", this);
  createPlayerAnimation("right", this);

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
}
