/**
 * @file typewriterEffect.js
 * @description Helper function to create a typewriter effect for displaying text in the game.
 * @version 1.0.1
 * @date 2024-06-24
 * @authoredBy L344S
 */

/**
 * Creates a typewriter effect for displaying text.
 * @param {Phaser.Scene} scene - The scene in which the text is displayed.
 * @param {string[]} phrases - The phrases to display.
 * @param {number} x - The x-coordinate of the text.
 * @param {number} y - The y-coordinate of the text.
 * @param {number} delayBetweenPhrases - The delay between phrases in milliseconds.
 * @param {string} color - The color of the text.
 * @param {number} wordWrapWidth - The width for word wrapping.
 * @param {function} callback - The callback function to call after the text is fully displayed.
 */
export function createTypewriterEffect(
  scene,
  phrases,
  x,
  y,
  delayBetweenPhrases,
  color,
  wordWrapWidth,
  callback
) {
  let textObject = scene.add
    .text(x, y, "", {
      fontFamily: "pixel times",
      fontSize: "14px",
      fill: color,
      wordWrap: { width: wordWrapWidth, useAdvancedWrap: true },
    })
    .setOrigin(0, 0);

  let totalDelay = 0;
  let skip = false;

  const isValidTextObject = (obj) =>
    obj && obj.scene && obj.scene.sys && !obj.scene.sys.isDestroying;

  const displayTextImmediately = () => {
    skip = true;
    textObject.setText(phrases[phrases.length - 1]);
    if (typeof callback === "function") {
      setTimeout(callback, 100);
    }
  };

  scene.skipTypewriter = displayTextImmediately;

  phrases.forEach((phrase, index) => {
    for (let i = 0; i <= phrase.length; i++) {
      setTimeout(() => {
        if (skip) return;
        if (isValidTextObject(textObject)) {
          textObject.setText(phrase.substring(0, i));
          if (index === phrases.length - 1 && i === phrase.length) {
            if (typeof callback === "function") {
              setTimeout(callback, 100);
            }
          }
        }
      }, totalDelay + i * 80);
    }
    totalDelay += phrase.length * 80 + delayBetweenPhrases;
  });
}
