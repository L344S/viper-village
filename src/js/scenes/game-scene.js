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
const PLAYER_SPEED = 250;
const ANIM_FRAMERATE = 9;

// Initialize the GameScene class that extends Phaser.Scene
export default class GameScene extends Phaser.Scene {
  constructor() {
    // Set the unique key for the GameScene
    super({ key: "GameScene" });
    this.keys = 1; // add the key cause there is not enough houses to get the keys
    this.resolvedHouses = {};
    this.failedHouses = {};
    this.encryptedHouses = {};
    this.filesEncrypted = false;
  }

  preload() {
    try {
      // Load all assets
      this.load.image("map", "../../assets/visual/map/map.png");
      this.load.image(
        "objectLayer",
        "../../assets/visual/map/layer_objects.png"
      );
      this.load.spritesheet(
        "player",
        "../../assets/visual/sprites/player.png",
        {
          frameWidth: 32,
          frameHeight: 48,
        }
      );
      this.load.spritesheet(
        "player_down",
        "../../assets/visual/sprites/player_walk_down.png",
        {
          frameWidth: 30,
          frameHeight: 30,
        }
      );
      this.load.spritesheet(
        "player_up",
        "../../assets/visual/sprites/player_walk_up.png",
        {
          frameWidth: 30,
          frameHeight: 29,
        }
      );
      this.load.spritesheet(
        "player_left",
        "../../assets/visual/sprites/player_walk_left.png",
        {
          frameWidth: 30,
          frameHeight: 30,
        }
      );
      this.load.spritesheet(
        "player_right",
        "../../assets/visual/sprites/player_walk_right.png",
        {
          frameWidth: 30,
          frameHeight: 30,
        }
      );
      this.load.image(
        "introImage",
        "../../assets/visual/windows/window-intro.png"
      );
      this.load.image(
        "controlsImage",
        "../../assets/visual/windows/window-controls.png"
      );
      this.load.image("key", "../../assets/visual/objects/key1.png");
      this.load.image(
        "alreadysolved",
        "../../assets/visual/windows/window-alreadysolved.png"
      );
      this.load.image(
        "riddlesolved",
        "../../assets/visual/windows/window-riddlesolved.png"
      );
      this.load.image(
        "trialFailed",
        "../../assets/visual/windows/window-trialfailed.png"
      );
      this.load.image(
        "fileEncrypted",
        "../../assets/visual/windows/window-wrong-encryption.png"
      );
      this.load.image(
        "needsMoreKeysImage",
        "../../assets/visual/windows/window-needsmorekeys.png"
      );
      this.load.image(
        "retryAnswer",
        "../../assets/visual/windows/window-retryanswer.png"
      );
      this.load.image(
        "closeButton",
        "../../assets/visual/buttons/close-button.png"
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

      // Transition effect to fade between scenes
      this.cameras.main.fadeIn(1000, 0, 0, 0);

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

      // Draw the intro modal window and show it to the player
      this.showIntroMessage();
      // Fix the key and text at the top left of the screen
      this.uiContainer = this.add.container(0, 0).setScrollFactor(0);
      this.keyIcon = this.add.image(50, 50, "key").setScale(0.5);
      this.keysText = this.add.text(90, 35, "Keys: 0", {
        fontSize: "32px",
        fill: "#fff",
      });
      this.uiContainer.add([this.keyIcon, this.keysText]);

      // Draw collision blocks all over the map and scale them to fit the map
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

      // Listen for keyboard input and set up player movement controls
      this.cursors = this.input.keyboard.createCursorKeys();

      // Set up camera to follow the player and set the bounds of the game world
      this.cameras.main.startFollow(this.player);
      this.cameras.main.setBounds(-800, -800, 5000, 3500);

      // Add an event listener for the Esc key to launch the pause menu
      this.input.keyboard.on("keydown-ESC", () => {
        this.scene.pause();
        this.scene.launch("MenuScene");
      });

      // Add a detection pixel for the player to interact with the purple house scene
      this.keyE = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
      );
      const purpleHouseDoor = this.add.rectangle(
        435,
        1190,
        44,
        44,
        0x000000,
        0
      );
      this.physics.add.existing(purpleHouseDoor);
      purpleHouseDoor.body.immovable = true;
      purpleHouseDoor.body.moves = false;

      this.physics.add.overlap(this.player, purpleHouseDoor, () => {
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
          if (
            !this.isHouseResolved("purpleHouse") &&
            !this.isHouseFailed("purpleHouse")
          ) {
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
              this.scene.pause("GameScene");
              this.scene.launch("PurpleHouseRiddleScene");
            });
          } else if (this.isHouseFailed("purpleHouse")) {
            this.showTrialFailedMessage();
          } else {
            this.showAlreadySolvedMessage();
          }
        }
      });

      const pinkHouseDoor = this.add.rectangle(425, 370, 44, 44, 0x000000, 0);
      this.physics.add.existing(pinkHouseDoor);
      pinkHouseDoor.body.immovable = true;
      pinkHouseDoor.body.moves = false;

      const handlePinkHouseOverlap = () => {
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
          if (
            !this.isHouseResolved("pinkHouse") &&
            !this.isHouseFailed("pinkHouse")
          ) {
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
              this.scene.pause("GameScene");
              this.scene.launch("PinkHouseRiddleScene");
            });
          } else if (this.isHouseFailed("pinkHouse")) {
            this.showTrialFailedMessage();
          } else {
            this.showAlreadySolvedMessage();
          }
        }
      };

      this.physics.add.overlap(
        this.player,
        pinkHouseDoor,
        handlePinkHouseOverlap
      );

      const greenHouseDoor = this.add.rectangle(1050, 420, 44, 44, 0x000000, 0);
      this.physics.add.existing(greenHouseDoor);
      greenHouseDoor.body.immovable = true;
      greenHouseDoor.body.moves = false;

      // Make sure the player can enter the green house from both doors
      const greenHouseDoor2 = this.add.rectangle(
        1640,
        320,
        44,
        44,
        0x000000,
        0
      );
      this.physics.add.existing(greenHouseDoor2);
      greenHouseDoor2.body.immovable = true;
      greenHouseDoor2.body.moves = false;

      const handleGreenHouseOverlap = () => {
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
          if (
            !this.isHouseResolved("greenHouse") &&
            !this.isHouseFailed("greenHouse")
          ) {
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
              this.scene.pause("GameScene");
              this.scene.launch("GreenHouseRiddleScene");
            });
          } else if (this.isHouseFailed("greenHouse")) {
            this.showTrialFailedMessage();
          } else {
            this.showAlreadySolvedMessage();
          }
        }
      };
      this.physics.add.overlap(
        this.player,
        greenHouseDoor,
        handleGreenHouseOverlap
      );
      this.physics.add.overlap(
        this.player,
        greenHouseDoor2,
        handleGreenHouseOverlap
      );

      // draw the pixel to detect the door of the tower
      const towerHouseDoor = this.add.rectangle(2480, 170, 44, 44, 0x000000, 0);
      this.physics.add.existing(towerHouseDoor);
      towerHouseDoor.body.immovable = true;
      towerHouseDoor.body.moves = false;

      // enter the tower scene when the player interacts with the door
      const handleTowerAccess = () => {
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
          if (this.canAccessTower()) {
            this.cameras.main.fadeOut(800, 0, 0, 0);
            this.time.delayedCall(800, () => {
              this.scene.pause("GameScene");
              this.scene.launch("TowerScene");
            });
          } else {
            this.showNeedsMoreKeysMessage();
          }
        }
      };
      this.physics.add.overlap(this.player, towerHouseDoor, handleTowerAccess);

      const brownHouseDoor = this.add.rectangle(
        2210,
        1230,
        44,
        44,
        0x000000,
        0
      );
      this.physics.add.existing(brownHouseDoor);
      brownHouseDoor.body.immovable = true;
      brownHouseDoor.body.moves = false;

      const redHouseDoor = this.add.rectangle(1800, 1230, 44, 44, 0x00000, 0);
      this.physics.add.existing(redHouseDoor);
      redHouseDoor.body.immovable = true;
      redHouseDoor.body.moves = false;

      const blueHouseDoor = this.add.rectangle(-130, 1065, 44, 44, 0x000000, 0);
      this.physics.add.existing(blueHouseDoor);
      blueHouseDoor.body.immovable = true;
      blueHouseDoor.body.moves = false;

      // Listen for the custom event "fileEncrypted" to show the file encrypted message
      this.events.on("fileEncrypted", this.showFileEncryptedMessage, this);
      // Listen for the custom event "wrongAnswerRetry" to show the retry answer message
      this.scene
        .get("PurpleHouseRiddleScene")
        .events.on("wrongAnswerRetry", this.showRetryAnswerMessage, this);
    } catch (error) {
      console.error("Error during game creation phase:", error);
    }
  }
  // Show the intro modal window and call the showControlsModal function
  showIntroMessage() {
    const veil = this.add
      .rectangle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.7
      )
      .setScrollFactor(0)
      .setDepth(9999);

    const introMessage = this.add
      .image(this.cameras.main.centerX, this.cameras.main.centerY, "introImage")
      .setScale(1)
      .setScrollFactor(0);

    introMessage.setDepth(10000);

    const closeButton = this.add
      .image(
        this.cameras.main.centerX + 340,
        this.cameras.main.centerY - 215,
        "closeButton"
      )
      .setScale(0.5)
      .setScrollFactor(0)
      .setInteractive();

    closeButton.setDepth(10001);
    closeButton.on("pointerdown", () => {
      introMessage.destroy();
      closeButton.destroy();
      veil.destroy();
      this.showControlsMessage();
    });
  }

  // Show controls message
  showControlsMessage() {
    const controlsMessage = this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "controlsImage"
      )
      .setScale(1)
      .setScrollFactor(0);

    controlsMessage.setDepth(10000);
    setTimeout(() => {
      controlsMessage.destroy();
    }, 5000);
  }
  resumeScene() {
    // Resume the game scene and fade in the camera
    this.cameras.main.fadeIn(800, 0, 0, 0);
  }

  addKey() {
    // Add a key to the player's inventory and update the UI
    this.keys += 1;
    this.keysText.setText("Keys: " + this.keys);
    this.showRiddleSolvedMessage();
  }
  // Flag to check if the player has enough keys to access the tower
  canAccessTower() {
    return this.keys >= 3;
  }
  resolveHouse(houseKey) {
    // Mark the house as resolved
    this.resolvedHouses[houseKey] = true;
  }
  isHouseResolved(houseKey) {
    // Check if the house is already resolved
    return this.resolvedHouses[houseKey] === true;
  }

  failHouse(houseKey) {
    // Mark the house as failed
    this.failedHouses[houseKey] = true;
  }
  isHouseFailed(houseKey) {
    // Check if the house has failed
    return this.failedHouses[houseKey] === true;
  }
  setHouseEncrypted(houseKey) {
    // Mark the house as encrypted
    this.encryptedHouses[houseKey] = true;
    this.filesEncrypted = true;
  }

  isHouseEncrypted(houseKey) {
    return this.encryptedHouses[houseKey] === true;
  }

  areFilesEncrypted() {
    // Check if the files are encrypted to avoid re-encryption
    return this.filesEncrypted;
  }

  setFilesEncrypted(value) {
    this.filesEncrypted = value;
  }
  // Show messages for different scenarios
  showRiddleSolvedMessage() {
    // Message to show when the riddle is solved
    const veil = this.add
      .rectangle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.2
      )
      .setScrollFactor(0)
      .setDepth(9999);
    const riddleSolvedMessage = this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "riddlesolved"
      )
      .setScale(1)
      .setScrollFactor(0);

    riddleSolvedMessage.setDepth(10000);
    const closeButton = this.add
      .image(
        this.cameras.main.centerX + 158, // might need to adjust position with responsiveness
        this.cameras.main.centerY - 145, // might need to adjust position with responsiveness
        "closeButton"
      )
      .setScale(0.5)
      .setScrollFactor(0)
      .setInteractive();

    closeButton.setDepth(10001);

    closeButton.on("pointerdown", () => {
      riddleSolvedMessage.destroy();
      closeButton.destroy();
      veil.destroy();
    });
  }

  showAlreadySolvedMessage() {
    // Message to show when the house is already solved
    const alreadySolvedMessage = this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "alreadysolved"
      )
      .setScale(1)
      .setScrollFactor(0);

    alreadySolvedMessage.setDepth(10000);
    const closeButton = this.add
      .image(
        this.cameras.main.centerX + 158, // might need to adjust position with responsiveness
        this.cameras.main.centerY - 145, // might need to adjust position with responsiveness
        "closeButton"
      )
      .setScale(0.5)
      .setScrollFactor(0)
      .setInteractive();

    closeButton.setDepth(10001);

    closeButton.on("pointerdown", () => {
      alreadySolvedMessage.destroy();
      closeButton.destroy();
    });
  }

  showTrialFailedMessage() {
    // Message to show when the player fails the trial
    const veil = this.add
      .image(this.cameras.main.centerX, this.cameras.main.centerY, "veil")
      .setScale(2)
      .setScrollFactor(0)
      .setDepth(9999);

    const trialFailedMessage = this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "trialFailed"
      )
      .setScale(1)
      .setScrollFactor(0);

    trialFailedMessage.setDepth(10000);
    const closeButton = this.add
      .image(
        this.cameras.main.centerX + 158,
        this.cameras.main.centerY - 145,
        "closeButton"
      )
      .setScale(0.5)
      .setScrollFactor(0)
      .setInteractive();

    closeButton.setDepth(10001);

    closeButton.on("pointerdown", () => {
      trialFailedMessage.destroy();
      closeButton.destroy();
      veil.destroy();
    });
  }

  showFileEncryptedMessage() {
    // Message to show when the file is encrypted
    const veil = this.add
      .rectangle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.2
      )
      .setScrollFactor(0)
      .setDepth(9999);

    const fileEncryptedMessage = this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "fileEncrypted"
      )
      .setScale(1)
      .setScrollFactor(0);

    fileEncryptedMessage.setDepth(10000);
    const closeButton = this.add
      .image(
        this.cameras.main.centerX + 158,
        this.cameras.main.centerY - 145,
        "closeButton"
      )
      .setScale(0.5)
      .setScrollFactor(0)
      .setInteractive();

    closeButton.setDepth(10001);

    closeButton.on("pointerdown", () => {
      fileEncryptedMessage.destroy();
      closeButton.destroy();
      veil.destroy();
    });
  }
  showRetryAnswerMessage() {
    // Show the retry answer message
    const veil = this.add
      .rectangle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.2
      )
      .setScrollFactor(0)
      .setDepth(9999);

    const retryAnswerMessage = this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "retryAnswer"
      )
      .setScale(1)
      .setScrollFactor(0);

    retryAnswerMessage.setDepth(10000);

    const closeButton = this.add
      .image(
        this.cameras.main.centerX + 158,
        this.cameras.main.centerY - 145,
        "closeButton"
      )
      .setScale(0.5)
      .setScrollFactor(0)
      .setDepth(10001)
      .setInteractive();

    closeButton.on("pointerdown", () => {
      retryAnswerMessage.destroy();
      closeButton.destroy();
      veil.destroy();
    });
  }
  showNeedsMoreKeysMessage() {
    const veil = this.add
      .rectangle(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        this.cameras.main.width,
        this.cameras.main.height,
        0x000000,
        0.2
      )
      .setScrollFactor(0)
      .setDepth(9999);

    const messageImage = this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "needsMoreKeysImage"
      )
      .setScale(1)
      .setScrollFactor(0)
      .setDepth(10000);

    const closeButton = this.add
      .image(
        this.cameras.main.centerX + 158,
        this.cameras.main.centerY - 145,
        "closeButton"
      )
      .setScale(0.5)
      .setScrollFactor(0)
      .setDepth(10001)
      .setInteractive();
    // close the window when the close button is clicked
    closeButton.on("pointerdown", () => {
      messageImage.destroy();
      closeButton.destroy();
      veil.destroy();
    });
  }
  // Create player animations for each direction and set the frame rate
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
    // Check for player movement input and play the corresponding animation
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-PLAYER_SPEED);
      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(PLAYER_SPEED);
      this.player.anims.play("right", true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-PLAYER_SPEED);
      this.player.anims.play("up", true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(PLAYER_SPEED);
      this.player.anims.play("down", true);
    } else {
      // Stop the player animation when no keys are pressed
      this.player.anims.stop();
    }
    // Set player depth based on Y position for layering
    this.player.depth = this.player.y + this.player.height;
  }

  // Restart the game scene
  restartScene() {
    this.scene.restart();
  }
  // Reset the game state to the initial values when the player exits the game
  resetGame() {
    this.keys = 0;
    this.resolvedHouses = {};
    this.failedHouses = {};
    this.keysText.setText("Keys: " + this.keys);
  }
}
