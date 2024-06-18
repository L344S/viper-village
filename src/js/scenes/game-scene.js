/**
 * @file game-scene.js
 * @description Main game scene for the Phaser 3 based game. Includes game configuration, asset loading,
 * scene creation, player animations, collision handling, and player movement updates.
 * @version 1.0.1
 * @date 2024-06-18
 * @authoredBy L344S
 */

// Imports
import { setCollision } from "../../../data/collisions.js";

// Constants
const PLAYER_SPEED = 160;
const ANIM_FRAMERATE = 9;

// Initialize the GameScene class that extends Phaser.Scene
export default class GameScene extends Phaser.Scene {
  constructor() {
    // Set the unique key for the GameScene
    super({ key: "GameScene" });
  }

  preload() {
    try {
      // Load all assets
      this.load.image("map", "../../assets/map.png");
      this.load.image("objectLayer", "../../assets/layer_objects.png");
      this.load.spritesheet("player", "../../assets/player.png", {
        frameWidth: 32,
        frameHeight: 48,
      });
      this.load.spritesheet(
        "player_down",
        "../../assets/player_walk_down.png",
        {
          frameWidth: 30,
          frameHeight: 30,
        }
      );
      this.load.spritesheet("player_up", "../../assets/player_walk_up.png", {
        frameWidth: 30,
        frameHeight: 29,
      });
      this.load.spritesheet(
        "player_left",
        "../../assets/player_walk_left.png",
        {
          frameWidth: 30,
          frameHeight: 30,
        }
      );
      this.load.spritesheet(
        "player_right",
        "../../assets/player_walk_right.png",
        {
          frameWidth: 30,
          frameHeight: 30,
        }
      );
    } catch (error) {
      // If an asset fails to load, throw an error
      console.error("Error during game preload phase:", error);
    }
  }

  /**
   * Create function to initialize game elements.
   * @method create
   * @returns {void}
   * @throws {Error} Will throw an error if any game element fails to create.
   * @description This function creates the game map, player, collision blocks, object layer, animations, and input handling.
   */
  create() {
    try {
      // Draw the map, set the dimensions and scale (0.9 to fit properly)
      const map = this.add.image(1140, 740, "map").setScale(0.938);
      if (!map) throw new Error("Failed to load map");

      // Draw the player sprite and set its scale
      this.player = this.physics.add.sprite(470, 380, "player").setScale(3);
      if (!this.player) throw new Error("Failed to load player sprite");
      // Set player depth based on Y position for layering
      this.player.depth = this.player.y;
      // Adjust player hitbox to match with collision block size
      this.player.body
        .setSize(this.player.width - 10, this.player.height - 40, false)
        .setOffset(0, 10);

      // Call the createPlayerAnimation function to create player animations
      this.createPlayerAnimation("down");
      this.createPlayerAnimation("up");
      this.createPlayerAnimation("left");
      this.createPlayerAnimation("right");

      // Draw collision blocks all over the map and scale it to fit the map
      setCollision.forEach((coords) => {
        const [x, y] = coords.split(",").map(Number);
        let colBlock = this.add
          // Define the collision block size and color
          .rectangle(x, y, 43, 43, 0x000000, 0)
          // Set the origin and scale of the collision block
          .setOrigin(23.6, 11.2)
          .setScale(1);
        if (!colBlock)
          throw new Error(`Failed to create collision block at ${x}, ${y}`);

        this.physics.add.existing(colBlock);
        // Set the collision block as immovable and add a collider with the player
        colBlock.body.immovable = true;
        this.physics.add.collider(this.player, colBlock);
      });

      // Create the object layer and set its depth to render above the player
      this.objectLayer = this.add.group();
      // Draw the object layer and set its scale
      const object = this.add.image(1141.5, 742, "objectLayer").setScale(4.05);
      if (!object) throw new Error("Failed to load the object layer");

      // Set the depth of the object layer
      object.depth = 1000;
      this.objectLayer.add(object);

      // Listen for keyboard input and set up player movement controls (arrow keys and WASD)
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys({
        up: Phaser.Input.Keyboard.KeyCodes.W,
        down: Phaser.Input.Keyboard.KeyCodes.S,
        left: Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      });

      // Set up camera to follow the player and set the bounds of the game world
      this.cameras.main.startFollow(this.player);
      this.cameras.main.setBounds(-800, -800, 5000, 3500);
    } catch (error) {
      console.error("Error during game creation phase:", error);
    }
  }

  /**
   * Function to create player animations.
   * @method createPlayerAnimation
   * @param {string} direction - The direction of the animation. (up, down, left, right)
   * @param {Phaser.Scene} scene - The scene object to create the animation. (create)
   * @returns {void}
   * @throws {Error} Will throw an error if the animation creation fails.
   * @description This function creates animations (change of sprite frames) based on the given direction.
   */
  createPlayerAnimation(direction) {
    try {
      // Create animations for each direction based on the sprite sheet
      this.anims.create({
        key: direction,
        frames: this.anims.generateFrameNumbers(`player_${direction}`, {
          start: 0,
          end: 3,
        }),
        frameRate: ANIM_FRAMERATE,
        repeat: -1,
      });
    } catch (error) {
      // If an animation fails to create, log an error
      console.error(
        `Error creating animation for direction ${direction}:`,
        error
      );
    }
  }

  /**
   * Update function to handle player movement.
   * @method update
   * @returns {void}
   * @description This function updates the player's movement based on keyboard input.
   */
  update() {
    // Stop the player movement and animation if no keys are pressed
    this.player.setVelocity(0);
    // Check for keyboard input, move and play the corresponding animation
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      this.player.setVelocityX(-PLAYER_SPEED);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      this.player.setVelocityX(PLAYER_SPEED);
      this.player.anims.play("right", true);
    } else if (this.cursors.up.isDown || this.wasd.up.isDown) {
      this.player.setVelocityY(-PLAYER_SPEED);
      this.player.anims.play("up", true);
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      this.player.setVelocityY(PLAYER_SPEED);
      this.player.anims.play("down", true);
    } else {
      // Stop the player animation when no keys are pressed
      this.player.anims.stop();
    }
    // Set player depth based on Y position for layering
    this.player.depth = this.player.y + this.player.height;
  }
}
