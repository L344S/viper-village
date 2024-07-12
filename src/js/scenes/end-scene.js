/**
 * @file end-scene.js
 * @description End scene for the game. Displays a goodbye message and options to restart or visit the game landing page.
 * @version 1.0.1
 * @date 2024-06-20
 * @authoredBy L344S
 *
 * Changelog:
 * - Added a goodbye message image to the end scene.
 * - Added restart button to restart the game.
 * - Added landing page button to visit the game landing page.
 * - Added GitHub button to visit the game repository.
 * - Added fade in effect to the end scene.
 */

export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: "EndScene" });
  }

  preload() {
    // Load all assets for the end scene
    this.load.image(
      "endBackground",
      "../../assets/visual/scenes/end-background.jpg"
    );
    this.load.image(
      "restartButton",
      "../../assets/visual/buttons/restart-button.png"
    );
    this.load.image(
      "webpageButton",
      "../../assets/visual/buttons/webpage-button.png"
    );
    this.load.image(
      "githubButton",
      "../../assets/visual/buttons/github-button.png"
    );
  }

  /**
   * Create function to initialize end scene elements.
   * @method create
   * @returns {void}
   * @description This function sets up the goodbye message, restart button, landing page button, and GitHub button
   */
  create() {
    // Draw the end background image and set its dimensions
    this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "endBackground"
      )
      .setOrigin(0.5)
      .setScale(1);

    // Draw the restart button image and set
    const restartButton = this.add
      .image(
        this.cameras.main.centerX + 380,
        this.cameras.main.centerY,
        "restartButton"
      )
      .setOrigin(0.5)
      .setInteractive();
    // Add click event to the restart button and lauch the intro scene
    restartButton.on("pointerdown", () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => {
        this.scene.start("IntroScene");
      });
    });

    // Draw the landing page button image and set its dimensions
    const webpageButton = this.add
      .image(
        this.cameras.main.centerX + 380,
        this.cameras.main.centerY + 70,
        "webpageButton"
      )
      .setOrigin(0.5)
      .setInteractive();
    // Add click event to the webpage button to visit the project landing page
    webpageButton.on("pointerdown", () => {
      window.location.href = "https://viper-village-project.fr";
    });

    // Draw the GitHub button image and set its dimensions
    const githubButton = this.add
      .image(
        this.cameras.main.centerX + 380,
        this.cameras.main.centerY + 140,
        "githubButton"
      )
      .setOrigin(0.5)
      .setInteractive();
    // Add click event to the GitHub button to visit the project repository
    githubButton.on("pointerdown", () => {
      window.location.href = "https://github.com/L344S/noname"; // private repo for now
    });

    // Fade in effect when the scene starts
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }
}
