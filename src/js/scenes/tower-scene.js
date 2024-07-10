/**
 * TEMPORARY JUST FOR TESTING NOT THE REAL SCENE
 * DONT PANIC
 */
export default class TowerScene extends Phaser.Scene {
  constructor() {
    super({ key: "TowerScene" });
  }

  preload() {
    this.load.image(
      "towerBackground",
      "../../assets/visual/scenes/intro-background.png"
    );
  }

  create() {
    this.add.image(0, 0, "towerBackground").setOrigin(0).setScale(1);

    const decryptionMessage = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY - 100,
        "You have overcome the curse!",
        { fontSize: "32px", fill: "#fff" }
      )
      .setOrigin(0.5);

    const decryptionButton = this.add
      .text(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        "Decrypt Files",
        { fontSize: "24px", fill: "#0f0" }
      )
      .setOrigin(0.5)
      .setInteractive();

    decryptionButton.on("pointerdown", async () => {
      await this.decryptFiles();
      this.add
        .text(
          this.cameras.main.centerX,
          this.cameras.main.centerY + 100,
          "Files Decrypted Successfully!",
          { fontSize: "24px", fill: "#0f0" }
        )
        .setOrigin(0.5);
    });
  }

  async decryptFiles() {
    console.log("Decrypting files...");
    try {
      const response = await axios.get("http://127.0.0.1:3000/decrypt");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error calling decryption API: ${error}`);
      throw error;
    }
  }
  //   preventNavigation() {
  //     history.pushState(null, null, location.href);
  //     window.addEventListener('popstate', this.preventNavigationHandler);
  //   }

  //   preventNavigationHandler(event) {
  //     history.pushState(null, null, location.href);
  //     console.log('Navigation prevented');
  //   }

  //   // Remove the event listener when the scene is stopped
  //   shutdown() {
  //     window.removeEventListener('popstate', this.preventNavigationHandler);
  //   }
}
