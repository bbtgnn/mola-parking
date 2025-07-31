import type p5 from "p5";
import { GameStateManager } from "./GameState";
import { AudioManager } from "./AudioManager";

export class MovementManager {
  private p: p5;
  private gameState: GameStateManager;
  private audioManager: AudioManager;

  constructor(p: p5, gameState: GameStateManager, audioManager: AudioManager) {
    this.p = p;
    this.gameState = gameState;
    this.audioManager = audioManager;
  }

  public updateAllMovement(): void {
    this.moveCar();
    this.moveEnemies();
    this.moveBoats();
  }

  public moveCar(): void {
    if (!this.gameState.car) return;

    let moving = false;

    if (this.p.keyIsDown(this.p.LEFT_ARROW)) {
      this.gameState.car.angle -= 0.06;
      moving = true;
    }
    if (this.p.keyIsDown(this.p.RIGHT_ARROW)) {
      this.gameState.car.angle += 0.06;
      moving = true;
    }
    if (this.p.keyIsDown(this.p.UP_ARROW)) {
      this.gameState.car.x +=
        this.p.cos(this.gameState.car.angle) * this.gameState.car.speed;
      this.gameState.car.y +=
        this.p.sin(this.gameState.car.angle) * this.gameState.car.speed;
      moving = true;
    }
    if (this.p.keyIsDown(this.p.DOWN_ARROW)) {
      this.gameState.car.x -=
        this.p.cos(this.gameState.car.angle) * this.gameState.car.speed * 0.6;
      this.gameState.car.y -=
        this.p.sin(this.gameState.car.angle) * this.gameState.car.speed * 0.6;
      moving = true;
    }

    // Constrain car to screen boundaries
    this.gameState.car.x = this.p.constrain(
      this.gameState.car.x,
      this.gameState.car.w / 2,
      this.p.width - this.gameState.car.w / 2
    );
    this.gameState.car.y = this.p.constrain(
      this.gameState.car.y,
      this.gameState.car.h / 2,
      this.p.height - 20
    );

    // Play motor sound based on movement
    this.audioManager.playMotorSound(moving);
  }

  public moveEnemies(): void {
    for (let enemy of this.gameState.enemies) {
      enemy.x += enemy.speed;
      if (enemy.x > this.p.width + 100) {
        enemy.x = -150;
      }
    }
  }

  public moveBoats(): void {
    for (let boat of this.gameState.boats) {
      boat.x += boat.speed;
      boat.wave += 0.02;
      if (boat.x > this.p.width + 100) {
        boat.x = -this.p.random(100, 200);
        boat.y = this.p.random(50, 150);
      }
    }
  }

  public resetCarPosition(): void {
    if (!this.gameState.car) return;

    this.gameState.car.x = 120;
    this.gameState.car.y = 550;
    this.gameState.car.angle = 0;
  }
}
