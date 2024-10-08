/**
 * @file menu-scene.js
 * @description Pause menu scene for the game. Displays options to resume or quit the game.
 * @version 1.0.1
 * @date 2024-06-19
 * @authoredBy L344S
 *
 * Changelog:
 * - Added transparent overlay to darken the game screen behind the menu board.
 * - Added interactive buttons for resuming and quitting the game.
 * - Improved error handling and organization of the code.
 */

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: "MenuScene" });
  }

  preload() {
    try {
      // Load all assets for the pause menu
      this.load.image("menuBoard", "../../assets/visual/scenes/menu-board.png");
      this.load.image(
        "playButton",
        "../../assets/visual/buttons/play-button1.png"
      );
      this.load.image(
        "homeButton",
        "../../assets/visual/buttons/home-button2.png"
      );
      this.load.image(
        "musicButton",
        "../../assets/visual/buttons/music-button.png"
      );
      this.load.image(
        "exitButton",
        "../../assets/visual/buttons/exit-button2.png"
      );
    } catch (error) {
      // If an asset fails to load, throw an error
      console.error("Error loading menu assets:", error);
    }
  }

  /**
   * Create function to initialize menu elements.
   * @method create
   * @returns {void}
   * @throws {Error} Will throw an error if any menu element fails to create.
   * @description This function sets up the pause menu background, resume button, and quit button with interactive features.
   */
  create() {
    try {
      // Add a transparent overlay to darken the game screen behind the menu board
      this.add
        .rectangle(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          this.cameras.main.width,
          this.cameras.main.height,
          0x000000,
          0.3
        )
        .setOrigin(0.5);

      // Draw the menu board image and scale it a bit larger
      const menuBoard = this.add
        .image(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          "menuBoard"
        )
        .setScale(1.1);
      if (!menuBoard) throw new Error("Failed to load menu board image");

      // Draw the play/continue button image and set its dimensions
      const playButton = this.add
        .image(
          this.cameras.main.centerX,
          this.cameras.main.centerY - 65,
          "playButton"
        )
        .setScale(1)
        .setInteractive();
      if (!playButton) throw new Error("Failed to load play button image");
      // Add click event to the play button to continue the game and close the menu
      playButton.on("pointerdown", () => {
        this.scene.resume("GameScene");
        this.scene.stop();
      });
      // Add an event listener for the Esc key to resume the game
      this.input.keyboard.on("keydown-ESC", () => {
        this.scene.resume("GameScene");
        this.scene.stop();
      });

      // NEED ONE MORE BUTTON FOR SETTINGS (MUSIC, SOUND, ETC.) LATER

      // Draw the home button image and set its dimensions
      const homeButton = this.add
        .image(
          this.cameras.main.centerX,
          this.cameras.main.centerY + 15,
          "homeButton"
        )
        .setScale(1)
        .setInteractive();
      if (!homeButton) throw new Error("Failed to load home button image");

      // Add click event to the home button to return to the main menu with a fade effect
      homeButton.on("pointerdown", () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.stop("GameScene");
          this.scene.start("IntroScene");
        });
      });

      const musicButton = this.add
        .image(
          this.cameras.main.centerX,
          this.cameras.main.centerY + 90,
          "musicButton"
        )
        .setScale(1)
        .setInteractive();
      if (!musicButton) throw new Error("Failed to load home button image");

      // Add click event to the home button to return to the main menu with a fade effect
      musicButton.on("pointerdown", () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.stop("GameScene");
          this.scene.start("IntroScene");
        });
      });

      // Draw the exit button image and set its dimensions
      const exitButton = this.add
        .image(
          this.cameras.main.centerX,
          this.cameras.main.centerY + 167,
          "exitButton"
        )
        .setScale(1)
        .setInteractive();
      if (!exitButton) throw new Error("Failed to load exit button image");
      // Add click event to the exit button (need the change that part when we have an exit scene)
      exitButton.on("pointerdown", () => {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.get("GameScene").resetGame();
          this.scene.stop("GameScene");
          this.scene.start("EndScene");
        });
      });
    } catch (error) {
      console.error("Error during menu creation phase:", error);
    }
  }
}
