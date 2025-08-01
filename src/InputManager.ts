import type p5 from "p5";
import { GameStateManager } from "./GameState";
import { LevelGenerator } from "./LevelGenerator";
import { AudioManager } from "./AudioManager";
import { config } from "./config";

export class InputManager {
  private p: p5;
  private gameState: GameStateManager;
  private levelGenerator: LevelGenerator;
  private audioManager: AudioManager;

  constructor(
    p: p5,
    gameState: GameStateManager,
    levelGenerator: LevelGenerator,
    audioManager: AudioManager
  ) {
    this.p = p;
    this.gameState = gameState;
    this.levelGenerator = levelGenerator;
    this.audioManager = audioManager;
  }

  public setupKeyHandlers(): void {
    this.p.keyPressed = () => {
      this.handleKeyPressed();
    };
  }

  private handleKeyPressed(): void {
    // Development toggle keys (only in development mode)
    if (config.development) {
      // Toggle dev UI with 'D' key
      if (this.p.key === "d" || this.p.key === "D") {
        config.show_dev_ui = !config.show_dev_ui;
        console.log(
          `🔧 Dev UI: ${config.show_dev_ui ? "ENABLED" : "DISABLED"}`
        );
        return;
      }

      // Toggle audio with 'A' key
      if (this.p.key === "a" || this.p.key === "A") {
        config.disable_audio_in_dev = !config.disable_audio_in_dev;
        console.log(
          `🔇 Audio: ${config.disable_audio_in_dev ? "DISABLED" : "ENABLED"}`
        );

        if (config.disable_audio_in_dev) {
          // Pause all audio including stopping continuous oscillators
          this.audioManager.pauseAllAudio();
        } else {
          // Initialize and start audio when enabling
          console.log("🔊 Initializing audio...");
          if (this.gameState.isPlaying()) {
            this.audioManager
              .initializeAudio()
              .then(() => {
                console.log("🔊 Audio initialized, starting music...");
                this.audioManager.playMusic();
              })
              .catch((error) => {
                console.warn("Failed to initialize audio:", error);
              });
          } else {
            // Just initialize audio for later use
            this.audioManager
              .initializeAudio()
              .then(() => {
                console.log("🔊 Audio initialized (ready for later use)");
              })
              .catch((error) => {
                console.warn("Failed to initialize audio:", error);
              });
          }
        }
        return;
      }
    }

    // Restart level on 'R' key when game over
    if ((this.p.key === "r" || this.p.key === "R") && this.gameState.gameOver) {
      this.restartLevel();
    }

    // Next level on 'N' key when won
    if (
      (this.p.key === "n" || this.p.key === "N") &&
      this.gameState.win &&
      this.gameState.level < 11
    ) {
      this.nextLevel();
    }
  }

  private restartLevel(): void {
    this.levelGenerator.resetCar();
    this.levelGenerator.generateLevel(this.gameState.level);
  }

  private nextLevel(): void {
    this.gameState.nextLevel();
    this.levelGenerator.resetCar();
    this.levelGenerator.generateLevel(this.gameState.level);

    // Update audio BPM for the new level
    this.audioManager.setLevel(this.gameState.level);
  }

  public isArrowKeyPressed(): boolean {
    return (
      this.p.keyIsDown(this.p.LEFT_ARROW) ||
      this.p.keyIsDown(this.p.RIGHT_ARROW) ||
      this.p.keyIsDown(this.p.UP_ARROW) ||
      this.p.keyIsDown(this.p.DOWN_ARROW)
    );
  }
}
