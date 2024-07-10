/**
 * @file green-house-riddle.js
 * @description Scene for the riddle in the green house. This file includes the riddle posed by the Guardian of the Green House
 * ALSO TEMPORARY NOT REAL ASSETS JUST FOR TESTING IM GOING TO CORRECT IT ASAP
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
    this.isCriticalOperation = false;
  }

  preload() {
    this.load.image(
      "GreenHouseRiddlePng",
      "../../assets/visual/scenes/green-house-background.png"
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
    this.attempts = 3;
    this.add.image(0, 0, "GreenHouseRiddlePng").setOrigin(0).setScale(0.6);
    this.add.image(650, 250, "bubble").setScale(1.07);

    const skipButton = this.add
      .image(915, 555, "skipButton")
      .setInteractive()
      .setScale(0.9)
      .on("pointerdown", () => {
        console.log("Skip button clicked");
        if (this.skipTypewriter) {
          this.skipTypewriter();
        }
      });

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
      console.log("Leave house button clicked");
      const riddleInput = document.getElementById("riddleInput");
      if (riddleInput) {
        riddleInput.remove();
      }
      this.scene.stop("GreenHouseRiddleScene");
      this.scene.resume("GameScene");
      this.scene.get("GameScene").resumeScene();
    });

    this.createFileInput();
    this.setupNavigationPrevention();
  }

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
    console.log("Creating riddle...");
    const TEXT_X = 335;
    const TEXT_Y = 470;
    const TEXT_COLOR = "#FFFFFF";

    this.add.image(512, 520, "textbox").setScale(1);
    const skipButton = this.add
      .image(915, 555, "skipButton")
      .setInteractive()
      .setScale(0.9)
      .on("pointerdown", () => {
        console.log("Skip button clicked during riddle");
        if (this.skipTypewriter) {
          this.skipTypewriter();
        }
      });

    createTypewriterEffect(
      this,
      // NEED TO CHANGE THIS RIDDLE AND THE ANSWER CUZ I DONT LIKE IT
      [
        "I present to you another ancient riddle. Solve it to continue your journey.",
        '"I am taken from a mine, and shut up in a wooden case, from which I am never released, and yet I am used by almost every person. What am I?"',
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
        console.log("Enter key pressed");
        this.checkAnswer(inputElement.value);
      }
    });

    const submitButton = this.add
      .image(625, 550, "submit")
      .setScale(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        console.log("Submit button clicked");
        this.checkAnswer(inputElement.value);
      });
  }

  async checkAnswer(answer) {
    console.log("Checking answer...");
    const correctAnswer = "pencil";
    const gameScene = this.scene.get("GameScene");

    if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
      console.log("Answer is correct");
      gameScene.resolveHouse("greenHouse");
      this.time.delayedCall(2000, () => {
        this.scene.stop("GreenHouseRiddleScene");
        this.scene.resume("GameScene");
        gameScene.addKey();
        gameScene.resumeScene();
        const riddleInput = document.getElementById("riddleInput");
        if (riddleInput) {
          riddleInput.remove();
        }
        this.isCriticalOperation = false;
      });
    } else {
      console.log("Answer is incorrect");
      this.attempts -= 1;
      if (this.attempts > 0) {
        this.showWrongAnswerMessage();
      } else {
        if (!gameScene.areFilesEncrypted()) {
          try {
            this.isCriticalOperation = true;
            await this.encryptFiles();
            gameScene.setFilesEncrypted(true);
            gameScene.setHouseEncrypted("greenHouse");
            console.log("Encryption completed");
          } catch (error) {
            console.error("Failed to encrypt files:", error);
            this.isCriticalOperation = false;
          }
        }
        this.time.delayedCall(1000, () => {
          console.log("Stopping GreenHouseRiddleScene");
          this.scene.stop("GreenHouseRiddleScene");
          console.log("Resuming GameScene");
          gameScene.failHouse("greenHouse");
          gameScene.events.emit("fileEncrypted");
          this.scene.resume("GameScene");
          gameScene.resumeScene();
          const riddleInput = document.getElementById("riddleInput");
          if (riddleInput) {
            riddleInput.remove();
          }
          this.isCriticalOperation = false;
        });
      }
    }
  }

  showWrongAnswerMessage() {
    console.log("Showing wrong answer message...");
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
    console.log("Encrypting files...");
    try {
      const response = await axios.get("http://127.0.0.1:3000/encrypt");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error calling encryption API: ${error}`);
      throw error;
    }
  }

  setupNavigationPrevention() {
    history.pushState(null, null, location.href);
    window.addEventListener("popstate", this.handlePopState.bind(this));
    window.addEventListener("beforeunload", this.handleBeforeUnload.bind(this));
  }

  handlePopState(event) {
    if (this.isCriticalOperation) {
      history.pushState(null, null, location.href);
      console.log("Navigation prevented");
    }
  }

  handleBeforeUnload(event) {
    if (this.isCriticalOperation) {
      event.preventDefault();
      event.returnValue = "";
    }
  }

  shutdown() {
    window.removeEventListener("popstate", this.handlePopState.bind(this));
    window.removeEventListener(
      "beforeunload",
      this.handleBeforeUnload.bind(this)
    );
  }

  stop() {
    super.stop();
    this.shutdown();
  }
}
