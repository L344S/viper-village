/**
 * Animate text by revealing it letter by letter.
 * note : This function is not used in the current version of the game, we replaced it with the createTypewriterEffect function.
 *
 */

export function animateText(target, speedInMs = 25) {
  if (!target || typeof target.text !== "string") {
    console.error(
      "animateText a été appelé avec un target invalide ou sans propriété text."
    );
    return Promise.reject(
      new Error("Target invalide ou propriété text manquante.")
    );
  }

  const message = target.text;
  const invisibleMessage = message.replace(/[^ ]/g, " ");
  target.text = "";
  let visibleText = "";

  return new Promise((resolve) => {
    const timer = target.scene.time.addEvent({
      delay: speedInMs,
      loop: true,
      callback() {
        if (visibleText.length === message.length) {
          timer.destroy();
          return resolve();
        }
        visibleText += message[visibleText.length];
        const invisibleText = invisibleMessage.substring(visibleText.length);
        target.text = visibleText + invisibleText;
      },
    });
  });
}
