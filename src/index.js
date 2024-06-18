/**
 * @file index.js
 * @description Main script for the Phaser 3 based game. This file includes game configuration, asset loading,
 * scene creation, player animations, collision handling, and player movement updates.
 * @version 1.0.1
 * @date 2024-06-18
 * @authoredBy L344S
 *
 * Changelog:
 * - Added error handling and checks for critical operations such as asset loading and collision management.
 * - Organized the code using ES6 modules for better maintainability.
 * - Adjusted object depth to ensure correct rendering of scene elements.
 */

// Imports
import { setCollision } from "../data/collisions.js";

// Constants
const GAME_WIDTH = 1024;
const GAME_HEIGHT = 600;
const PLAYER_SPEED = 160;
const FRAMERATE = 9;

// Game configuration object (Phaser 3)
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
      // Handle chrome's 2d rendering bug
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

// Game object initialization
const game = new Phaser.Game(config);

// Variables
let player;
let cursors;
let wasd;
let objectLayer;

/**
 * Preload function to load game assets.
 * @function preload
 * @returns {void}
 * @throws {Error} Will throw an error if any asset fails to load.
 * @description This function loads the game map, player sprites, and object layer assets.
 */
function preload() {
  try {
    // Load all assets
    this.load.image("map", "../assets/map.png");
    this.load.image("objectLayer", "../assets/layer_objects.png");
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
  } catch (error) {
    // If an asset fails to load, throw an error
    console.error("Error during game preload phase:", error);
  }
}

/**
 * Create function to initialize game elements.
 * @function create
 * @returns {void}
 * @throws {Error} Will throw an error if any game element fails to create.
 * @description This function creates the game map, player, collision blocks, object layer, animations, and input handling.
 */
function create() {
  try {
    // Draw the map, set the dimensions and scale (0.9 to fit properly)
    const map = this.add.image(1140, 740, "map").setScale(0.938);
    if (!map) throw new Error("Failed to load map");

    // Draw the player sprite and set its scale
    player = this.physics.add.sprite(470, 380, "player").setScale(3);
    if (!player) throw new Error("Failed to load player sprite");
    // Set player depth based on Y position for layering
    player.depth = player.y;
    // Adjust player hitbox to match with collision block size
    player.body
      .setSize(player.width - 10, player.height - 40, false)
      .setOffset(0, 10);

    // Call the createPlayerAnimation function to create player animations
    createPlayerAnimation("down", this);
    createPlayerAnimation("up", this);
    createPlayerAnimation("left", this);
    createPlayerAnimation("right", this);

    // Draw collision blocks all over the map and scale it to fit the map
    setCollision.forEach((coords) => {
      const [x, y] = coords.split(",").map(Number);
      let colBlock = this.add
        // Define the collision block size, color (invisible)
        .rectangle(x, y, 43, 43, 0x000000, 0)
        // Set the origin and scale to match the map underneath
        .setOrigin(23.6, 11.2)
        .setScale(1);
      if (!colBlock)
        throw new Error(`Failed to create collision block at ${x}, ${y}`);

      this.physics.add.existing(colBlock);
      // Set the collision block as immovable and add collision with the player
      colBlock.body.immovable = true;
      this.physics.add.collider(player, colBlock);
    });

    // Create the object layer and set its depth to render above the player
    objectLayer = this.add.group();
    // Draw the object layer and scale it to match properly the map
    const object = this.add.image(1141.5, 742, "objectLayer").setScale(4.05);
    if (!object) throw new Error("Failed to load the object layer");

    // Set the depth of the object layer to make the player render below it
    object.depth = 1000;
    objectLayer.add(object);

    // Listen for keyboard input and set up player movement controls (arrow keys and WASD)
    cursors = this.input.keyboard.createCursorKeys();
    wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    // Set up camera to follow the player and set the bounds of the game world
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(-800, -800, 5000, 3500);
  } catch (error) {
    console.error("Error during game creation phase:", error);
  }
}

/**
 * Function to create player animations.
 * @function createPlayerAnimation
 * @param {string} direction - The direction of the animation. (up, down, left, right)
 * @param {Phaser.Scene} scene - The scene object to create the animation. (create)
 * @returns {void}
 * @throws {Error} Will throw an error if the animation creation fails.
 * @description This function creates animations (change of sprite frames) based on the given direction.
 */
function createPlayerAnimation(direction, scene) {
  try {
    // Create animations for each direction
    scene.anims.create({
      key: direction,
      frames: scene.anims.generateFrameNumbers(`player_${direction}`, {
        start: 0,
        end: 3,
      }),
      frameRate: FRAMERATE,
      repeat: -1,
    });
  } catch (error) {
    // If an animation fails to create, throw an error
    console.error(
      `Error creating animation for direction ${direction}:`,
      error
    );
  }
}

/**
 * Update function to handle player movement.
 * @function update
 * @returns {void}
 * @description This function updates the player's movement based on keyboard input.
 */
function update() {
  // Stop the player from moving when no keys are pressed
  player.setVelocity(0);
  // Check for player movement input and play the corresponding animation
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
    // Stop the player animation when no keys are pressed
    player.anims.stop();
  }
  // Set the player depth based on Y position for layering in the scene
  player.depth = player.y + player.height;
}
