/**
 * @file index.js
 * @description Main script for the Phaser 3 based game. Includes game configuration and scene management.
 * @version 1.0.1
 * @date 2024-06-18
 * @authoredBy L344S
 *
 * Changelog:
 * - Divide the game into multiple scenes for better organization and maintainability.
 * - Implement a intro scene to handle game start and the exit later.
 * - Implement a pause menu scene to handle game pausing and resuming.
 */

// Imports
import IntroScene from "./scenes/intro-scene.js";
import GameScene from "./scenes/game-scene.js";
import MenuScene from "./scenes/menu-scene.js";

// Game configuration object (Phaser 3)
const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
    },
  },
  render: {
    pixelArt: true,
    contextAttributes: {
      willReadFrequently: true,
    },
  },
  scene: [IntroScene, GameScene, MenuScene],
};

// Game object initialization
const game = new Phaser.Game(config);
