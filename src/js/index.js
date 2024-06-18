/**
 * @file index.js
 * @description Main script for the Phaser 3 based game. Includes game configuration and scene management.
 * @version 1.0.1
 * @date 2024-06-18
 * @authoredBy L344S
 *
 * Changelog:
 * - Divide the game into multiple scenes for better organization and maintainability.
 * - Implement a menu scene to handle game start and the exit later.
 */

// Imports
import MenuScene from "./scenes/menu-scene.js";
import GameScene from "./scenes/game-scene.js";

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
  scene: [MenuScene, GameScene],
};

// Game object initialization
const game = new Phaser.Game(config);
