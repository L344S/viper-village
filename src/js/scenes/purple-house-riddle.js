/**
 * @file purple-house-riddle.js
 * @description Scene for the riddle in the purple house. This file includes the riddle posed by the Sage of Wisdom
 * and the logic for the player to solve the riddle.
 * @version 1.0.1
 * @date 2024-06-19
 * @authoredBy L344S
 */

// Imports
import { createTypewriterEffect } from "../helpers/typewriterEffect.js";

export default class PurpleHouseRiddleScene extends Phaser.Scene {
  constructor() {
    super({ key: "PurpleHouseRiddleScene" });
    this.attempts = 3;
  }

  preload() {
    // Load all assets
    this.load.image(
      "PurpleHouseRiddlePng",
      "../../assets/visual/scenes/purple-house-background.png"
    );
    this.load.image(
      "leaveHouseButton",
      "../../assets/visual/buttons/leave-button.png"
    );
    this.load.image(
      "bubble",
      "../../assets/visual/dialogues/speech-bubble-cream.png"
    );
    this.load.image(
      "textbox",
      "../../assets/visual/dialogues/black-text-box2.png"
    );
    this.load.image("submit", "../../assets/visual/buttons/submit-button.png");
    this.load.image(
      "wrongAnswer",
      "../../assets/visual/windows/window-wronginput.png"
    );
    this.load.image(
      "skipButton",
      "../../assets/visual/buttons/skip-button.png"
    );
  }

  create() {
    // Reset attempts at the start of the scene
    this.attempts = 3;
    // Set up the background and bubble
    this.add.image(0, 0, "PurpleHouseRiddlePng").setOrigin(0).setScale(1);
    this.add.image(650, 250, "bubble").setScale(1.07);

    const skipButton = this.add
      .image(915, 555, "skipButton")
      .setInteractive()
      .setScale(0.9)
      .on("pointerdown", () => {
        if (this.skipTypewriter) {
          this.skipTypewriter();
        }
      });
    // Create the typewriter effect for the introductory dialogue
    createTypewriterEffect(
      this,
      [
        "Welcome, seeker of truth. I am Arion, the Sage of Wisdom.",
        "To prove that you are worthy of lifting the curse and continuing your journey,",
        "you must solve the riddle I will pose to you. Think carefully, for every detail counts.",
        "Here is your first trial:",
      ],
      568,
      210,
      1000,
      "#000000",
      177,
      () => {
        this.createRiddle();
        skipButton.destroy();
      }
    );

    // Create the leave house button
    const leaveHouseButton = this.add
      .image(
        this.cameras.main.centerX - 481,
        this.cameras.main.centerY - 247,
        "leaveHouseButton"
      )
      .setScale(1)
      .setInteractive();

    if (!leaveHouseButton) throw new Error("Failed to load play button image");

    // Add the leave house button functionality
    leaveHouseButton.on("pointerdown", () => {
      const riddleInput = document.getElementById("riddleInput");
      if (riddleInput) {
        riddleInput.remove();
      }
      this.scene.stop("PurpleHouseRiddleScene");
      this.scene.resume("GameScene");
      this.scene.get("GameScene").resumeScene();
    });
  }

  createRiddle() {
    const TEXT_X = 335;
    const TEXT_Y = 470;
    const TEXT_COLOR = "#FFFFFF";

    // Set up the textbox and typewriter effect for the riddle
    this.add.image(512, 520, "textbox").setScale(1);
    const skipButton = this.add
      .image(915, 555, "skipButton")
      .setInteractive()
      .setScale(0.9)
      .on("pointerdown", () => {
        if (this.skipTypewriter) {
          this.skipTypewriter();
        }
      });
    createTypewriterEffect(
      this,
      [
        "I present to you an ancient riddle, one that has puzzled many wise individuals over the centuries. Try, type your answer below and click submit to see if you have uncovered the truth.",
        '"I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?"',
      ],
      TEXT_X,
      TEXT_Y,
      1000,
      TEXT_COLOR,
      330,
      () => {
        skipButton.destroy();
        this.createInput();
      }
    );
  }

  // THIS PART NEEDS TO BE CORRECTED BUT IM LAZY
  // 9-07-2024 : still lazy
  createInput() {
    // Create the input element
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.id = "riddleInput";
    inputElement.className = "classeInput";
    inputElement.placeholder = "Type your answer here...";

    // Add event listeners to the input element
    inputElement.addEventListener("focus", () => {
      this.input.keyboard.enabled = false;
    });

    inputElement.addEventListener("blur", () => {
      this.input.keyboard.enabled = true;
    });

    document.body.appendChild(inputElement);
    // Create the submit button and add its functionality
    const submitButton = this.add
      .image(625, 550, "submit")
      .setScale(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.checkAnswer(inputElement.value);
      });
  }

  checkAnswer(answer) {
    const correctAnswer = "echo";
    const gameScene = this.scene.get("GameScene");
    // Check if the answer is correct
    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      // Resolve the house and resume the game scene and add the key
      gameScene.resolveHouse("purpleHouse");
      this.time.delayedCall(2000, () => {
        this.scene.stop("PurpleHouseRiddleScene");
        this.scene.resume("GameScene");
        gameScene.addKey();
        gameScene.resumeScene();
        document.getElementById("riddleInput").remove();
      });
    } else {
      // Encrypted file when the player fails to solve the riddle 3 times
      this.attempts -= 1;
      if (this.attempts > 0) {
        this.showWrongAnswerMessage();
      } else {
        this.encryptFile();
        this.time.delayedCall(1000, () => {
          this.scene.stop("PurpleHouseRiddleScene");
          gameScene.failHouse("purpleHouse");
          gameScene.events.emit("fileEncrypted");
          this.scene.resume("GameScene");
          gameScene.resumeScene();
          document.getElementById("riddleInput").remove();
        });
      }
    }
  }

  showWrongAnswerMessage() {
    // Show the wrong answer message
    const wrongAnswerMessage = this.add
      .image(
        this.cameras.main.centerX - 260,
        this.cameras.main.centerY - 20,
        "wrongAnswer"
      )
      .setScale(1)
      .setScrollFactor(0);

    // layering the wrong answer message above everything else
    wrongAnswerMessage.setDepth(10000);

    this.time.delayedCall(3000, () => {
      wrongAnswerMessage.destroy();
    });
  }

  encryptFile() {
    // waiting for the encryption logic to be implemented
    console.log("A file has been encrypted!");
  }
}
