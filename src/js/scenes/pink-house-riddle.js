/**
 * @file pink-house-riddle.js
 * @description Scene for the riddle in the Pink House. This file includes the riddle posed by the Guardian of the Pink House
 * @version 1.0.1
 * @date 2024-07-11
 * @authoredBy L344S
 */

// Imports
import { createTypewriterEffect } from "../helpers/typewriterEffect.js";

// TRY TO ADD AS MANY COMMENTS AS POSSIBLE
export default class PinkHouseRiddleScene extends Phaser.Scene {
  constructor() {
    super({ key: "PinkHouseRiddleScene" });
    this.attempts = 3;
  }

  preload() {
    // loaddind of the nedeed assets
    this.load.image(
      "PinkHouseRiddlePng",
      "../../assets/visual/scenes/pink-house-background1.png"
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
    this.add.image(0, 0, "PinkHouseRiddlePng").setOrigin(0).setScale(0.59);
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

    // display the text for the intro story and the input field
    createTypewriterEffect(
      this,
      [
        "Welcome, seeker of truth. I am Seraphina, the Guardian of the Pink House.",
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
    // create the leave house button  and make it interactive
    const leaveHouseButton = this.add
      .image(
        this.cameras.main.centerX - 481,
        this.cameras.main.centerY - 247,
        "leaveHouseButton"
      )
      .setScale(1)
      .setInteractive();

    if (!leaveHouseButton) throw new Error("Failed to load leave button image");

    leaveHouseButton.on("pointerdown", () => {
      const riddleInput = document.getElementById("riddleInput");
      if (riddleInput) {
        riddleInput.remove();
      }
      this.removeBeforeUnloadListener();
      this.scene.stop("PinkHouseRiddleScene");
      this.scene.resume("GameScene");
      this.scene.get("GameScene").resumeScene();
    });

    this.createFileInput();
    this.addBeforeUnloadListener();
  }
  // create the file input
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
  // create and diplay the riddle 
  createRiddle() {
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
        '"I can be broken without being touched, I can be stolen without being seen. What am I?"',
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
  // create the input field for the answer
  createInput() {
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
    })
    // create the submit button and make it interactive
    const submitButton = this.add
      .image(625, 550, "submit")
      .setScale(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.checkAnswer(inputElement.value);
      });
  }
  // check the answer and decide what to do next
  async checkAnswer(answer) {
    const correctAnswer = "Trust";
    const gameScene = this.scene.get("GameScene");
    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      // the answer is correct so the house is resolved go back to the game scene
      gameScene.resolveHouse("pinkHouse");
      this.time.delayedCall(2000, () => {
        this.removeBeforeUnloadListener();
        this.scene.stop("PinkHouseRiddleScene");
        this.scene.resume("GameScene");
        gameScene.addKey();
        gameScene.resumeScene();
        const riddleInput = document.getElementById("riddleInput");
        if (riddleInput) {
          riddleInput.remove();
        }
      });
    } else {
      // wrong answer, let him answer again
      this.attempts -= 1;
      if (this.attempts > 0) {
        // show the wrong answer message
        this.showWrongAnswerMessage();
      } else {
       // no more attempts left, encrypt the files
        if (!gameScene.areFilesEncrypted()) {
          try {
            this.isCriticalOperation = true;
            await this.encryptFiles();
            gameScene.setFilesEncrypted(true);
            gameScene.setHouseEncrypted("pinkHouse");
            console.log("Encryption completed");
          } catch (error) {
            console.error("Failed to encrypt files:", error);
          }
        }
        // go back to the game scene
        this.time.delayedCall(1000, () => {
          this.removeBeforeUnloadListener();
          this.scene.stop("PinkHouseRiddleScene");
          gameScene.failHouse("pinkHouse");
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
    // display little window with the wrong answer message
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
    // function to trigger the encryption script
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
    // bug : this need handle a bug of the browser we the encryption is in progress
    window.addEventListener("beforeunload", this.beforeUnloadHandler);
  }

  removeBeforeUnloadListener() {
    window.removeEventListener("beforeunload", this.beforeUnloadHandler);
  }

  beforeUnloadHandler(event) {
    // avoid the browser to refresh the page and reset the game
    event.preventDefault();
    event.returnValue = "";
  }
}
