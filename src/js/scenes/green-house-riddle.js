/**
 * @file green-house-riddle.js
 * @description Scene for the riddle in the green house. This file includes the riddle posed by the Guardian of the Green House
 * @version 1.0.1
 * @date 2024-07-10
 * @authoredBy L344S
 */

// Imports
import { createTypewriterEffect } from "../helpers/typewriterEffect.js";

export default class GreenHouseRiddleScene extends Phaser.Scene {
  constructor() {
    super({ key: "GreenHouseRiddleScene" });
    this.attempts = 3;
  }

  preload() {
    // loading of the needed assets
    this.load.image(
      "GreenHouseRiddlePng",
      "../../assets/visual/scenes/green-house-background1.png"
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
    // Reset attempts at the start of the scene, draw the background and bubble
    this.attempts = 3;
    this.add.image(0, 0, "GreenHouseRiddlePng").setOrigin(0).setScale(0.59);
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
    // call the createTypewriterEffect function to display the riddle
    createTypewriterEffect(
      this,
      [
        "Welcome, seeker of truth. I am Elara, the Guardian of the Green House.",
        "To prove that you are worthy of lifting the curse and continuing your journey,",
        "you must solve the riddle I will pose to you. Think carefully, for every detail counts.",
        "Here is your trial:",
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
    // create the leave house button and add an event listener to it
    const leaveHouseButton = this.add
      .image(
        this.cameras.main.centerX - 481,
        this.cameras.main.centerY - 247,
        "leaveHouseButton"
      )
      .setScale(1)
      .setInteractive();

    if (!leaveHouseButton) throw new Error("Failed to load play button image");

    leaveHouseButton.on("pointerdown", () => {
      const riddleInput = document.getElementById("riddleInput");
      if (riddleInput) {
        riddleInput.remove();
      }
      this.removeBeforeUnloadListener();
      this.scene.stop("GreenHouseRiddleScene");
      this.scene.resume("GameScene");
      this.scene.get("GameScene").resumeScene();
    });

    this.createFileInput();
    this.addBeforeUnloadListener();
  }
  // create the file input element to be used for the decryption
  createFileInput() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput) {
      const inputElement = document.createElement("input");
      inputElement.type = "file";
      inputElement.id = "fileInput";
      inputElement.multiple = true;
      inputElement.style.display = "none";
      document.body.appendChild(inputElement);
    }
  }

  createRiddle() {
    // set the text for the riddle and create the input field
    const TEXT_X = 335;
    const TEXT_Y = 470;
    const TEXT_COLOR = "#FFFFFF";

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
        "I present to you another ancient riddle. Solve it to have a chance to lift the curse.",
        '"I guard your secrets, but I am intangible. I can be cracked but never seen. What am I?"',
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

  createInput() {
    // create the input field for the answer
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.id = "riddleInput";
    inputElement.className = "classeInput";
    inputElement.placeholder = "Type your answer here...";

    inputElement.addEventListener("focus", () => {
      this.input.keyboard.enabled = false;
    });

    inputElement.addEventListener("blur", () => {
      this.input.keyboard.enabled = true;
    });

    document.body.appendChild(inputElement);

    inputElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.checkAnswer(inputElement.value);
      }
    });

    const submitButton = this.add
      // draw the submit button and make it interactive
      .image(625, 550, "submit")
      .setScale(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.checkAnswer(inputElement.value);
      });
  }

  async checkAnswer(answer) {
    // check the answer and decide what to do next
    const correctAnswer = "password";
    const gameScene = this.scene.get("GameScene");
    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      // if the answer is correct, resolve the house and resume the game
      gameScene.resolveHouse("greenHouse");
      this.time.delayedCall(2000, () => {
        this.removeBeforeUnloadListener();
        this.scene.stop("GreenHouseRiddleScene");
        this.scene.resume("GameScene");
        gameScene.addKey();
        gameScene.resumeScene();
        const riddleInput = document.getElementById("riddleInput");
        if (riddleInput) {
          riddleInput.remove();
        }
      });
    } else {
      // if the answer is wrong, show a message and decrement
      this.attempts -= 1;
      if (this.attempts > 0) {
        this.showWrongAnswerMessage();
      } else {
        // no more attempts, encrypt the files and resume the game
        if (!gameScene.areFilesEncrypted()) {
          try {
            this.isCriticalOperation = true;
            await this.encryptFiles();
            gameScene.setFilesEncrypted(true);
            gameScene.setHouseEncrypted("greenHouse");
            console.log("Encryption completed");
          } catch (error) {
            console.error("Failed to encrypt files:", error);
          }
        }
        this.time.delayedCall(1000, () => {
          this.removeBeforeUnloadListener();
          this.scene.stop("GreenHouseRiddleScene");
          gameScene.failHouse("greenHouse");
          gameScene.events.emit("fileEncrypted");
          this.scene.resume("GameScene");
          gameScene.resumeScene();
          const riddleInput = document.getElementById("riddleInput");
          if (riddleInput) {
            riddleInput.remove();
          }
        });
      }
    }
  }

  showWrongAnswerMessage() {
    // show the little message when the answer is wrong
    const wrongAnswerMessage = this.add
      .image(
        this.cameras.main.centerX - 260,
        this.cameras.main.centerY - 20,
        "wrongAnswer"
      )
      .setScale(1)
      .setScrollFactor(0);
    wrongAnswerMessage.setDepth(10000);
    this.time.delayedCall(3000, () => {
      wrongAnswerMessage.destroy();
    });
  }

  async encryptFiles() {
    // call the encryption script to encrypt the files
    console.log("Encrypting files...");
    try {
      const response = await axios.get("http://127.0.0.1:3000/encrypt");
      return response.data;
    } catch (error) {
      console.error(`Error calling encryption API: ${error}`);
      throw error;
    }
  }

  addBeforeUnloadListener() {
    // add the before unload listener to prevent accidental leaving
    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  }

  removeBeforeUnloadListener() {
    window.removeEventListener("beforeunload", this.beforeUnloadHandler);
  }

  beforeUnloadHandler(event) {
    // handle the refresh of the page
    event.preventDefault();
    event.returnValue = "";
  }
}
