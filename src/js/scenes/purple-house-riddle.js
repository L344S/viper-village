/**
 * @file riddle-scene.js
 * @description Riddle scene for the game. Displays a riddle when the player enters the riddle house. The player must solve the riddle to proceed.
 * @version 1.0.1
 * @date 2024-06-19
 * @authoredBy L344S
 */

export default class PurpleHouseRiddleScene extends Phaser.Scene {
  constructor() {
    super({ key: "PurpleHouseRiddleScene" });
  }

  preload() {
    this.load.image("PurpleHouseRiddlePng", "../../assets/purple-house-riddle-character.png");
  }

  create() {
    this.add.image(0, 0, "PurpleHouseRiddlePng").setOrigin(0).setScale(0.5);
  }
}
