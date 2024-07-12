/**
 * @file TowerScene.js
 * @description Scene for the tower in the game. This file includes the logic for the player to decrypt files.
 * @version 1.0.1
 * @date 2024-07-11
 * @authoredBy L344S
 */
export default class TowerScene extends Phaser.Scene {
  constructor() {
    super({ key: "TowerScene" });
  }

  preload() {
    this.load.image(
      "towerBackground",
      "../../assets/visual/scenes/tower-background.png"
    );
    this.load.image(
      "decryptButton",
      "../../assets/visual/buttons/decrypt-button.png"
    );
  }

  create() {
    this.add.image(0, 0, "towerBackground").setOrigin(0).setScale(1);
    // Draw the decryption button and make it interactive
    const decryptionButton = this.add
      .image(
        this.cameras.main.centerX,
        this.cameras.main.centerY + 110,
        "decryptButton"
      )
      .setOrigin(0.5)
      .setScale(1)
      .setInteractive();

    decryptionButton.on("pointerdown", async () => {
      try {
        const result = await this.decryptFiles();
        // Log the result of the decryption if successful
        console.log("Decryption successful:", result);
      } catch (error) {
        // Log an error if the decryption fails
        console.error("Decryption failed:", error);
      }
    });
  }

  async decryptFiles() {
    console.log("Decrypting files...");
    try {
      // Call the decryption script to decrypt the files
      const response = await axios.get("http://127.0.0.1:3000/decrypt");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error calling decryption API: ${error}`);
      throw error;
    }
  }
}
