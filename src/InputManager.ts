import type p5 from "p5";
import { GameStateManager } from "./GameState";
import { LevelGenerator } from "./LevelGenerator";
import { AudioManager } from "./AudioManager";

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
