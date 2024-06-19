/**
 * @file intro-scene.js
 * @description Introduction scene for the game. Displays the game logo and a play button to start the game.
 * @version 1.0.1
 * @date 2024-06-18
 * @authoredBy L344S
 */

// Initialize the MenuScene class that extends Phaser.Scene
export default class IntroScene extends Phaser.Scene {
  constructor() {
    // Set the unique key for the MenuScene
    super({ key: "IntroScene" });
  }

  preload() {
    // Load assets for the menu scene
    try {
      // Load all assets
      this.load.image("background", "../../assets/logo.png");
      this.load.image("startButton", "../../assets/button.png");
    } catch (error) {
      // If an asset fails to load, throw an error
      console.error("Error during menu preload phase:", error);
    }
  }

  /**
   * Create function to initialize menu elements.
   * @method create
   * @returns {void}
   * @throws {Error} Will throw an error if any menu element fails to create.
   * @description This function sets up the menu background, title text, and Play button with interactive features.
   */
  create() {
    try {
      // Draw the background image et set the origin to the center
      const background = this.add
        .image(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          "background"
        )
        .setOrigin(0.5);
      if (!background) throw new Error("Failed to load background image");

      // Draw the start button image and set the scale
      const startButton = this.add
        .image(
          this.cameras.main.centerX,
          this.cameras.main.centerY + 205, // Adjusted position for better layout
          "startButton"
        )
        .setScale(0.8);
      if (!startButton) throw new Error("Failed to load play button image");

      // Add event listener to the play button
      startButton.setInteractive();
      // Add transition effect to fade out the menu scene and start the game scene
      startButton.on("pointerdown", () => {
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => {
          this.scene.start("GameScene");
        });
      });
    } catch (error) {
      // If an element fails to create, throw an error
      console.error("Error during menu creation phase:", error);
    }
  }
}
