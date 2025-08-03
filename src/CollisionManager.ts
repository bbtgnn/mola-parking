import type p5 from "p5";
import type { Car, Obstacle, Enemy, Boat } from "./types";
import { GameStateManager } from "./GameState";
import { AudioManager } from "./AudioManager";
import { config } from "./config";

export class CollisionManager {
  private p: p5;
  private gameState: GameStateManager;
  private audioManager: AudioManager;

  constructor(p: p5, gameState: GameStateManager, audioManager: AudioManager) {
    this.p = p;
    this.gameState = gameState;
    this.audioManager = audioManager;
  }

  public checkAllCollisions(): void {
    if (!this.gameState.car || !this.gameState.parkingSpot) return;

    // Check collisions with obstacles
    for (let obstacle of this.gameState.obstacles) {
      if (this.checkCollision(this.gameState.car, obstacle)) {
        if (!this.gameState.gameOver) {
          this.audioManager.playHorn();
        }
        this.gameState.gameOver = true;
      }
    }

    // Check collisions with enemies
    for (let enemy of this.gameState.enemies) {
      if (this.checkCollision(this.gameState.car, enemy)) {
        if (!this.gameState.gameOver) {
          this.audioManager.playHorn();
        }
        this.gameState.gameOver = true;
      }

      // Check if enemy reaches parking spot
      if (
        this.p.abs(enemy.x - this.gameState.parkingSpot.x) < 20 &&
        this.p.abs(enemy.y - this.gameState.parkingSpot.y) < 20
      ) {
        if (!this.gameState.gameOver) {
          this.audioManager.playEnemySiren();
        }
        this.gameState.gameOver = true;
      }
    }

    // Check collisions with boats
    for (let boat of this.gameState.boats) {
      if (this.checkCollision(this.gameState.car, boat)) {
        if (!this.gameState.gameOver) {
          this.audioManager.playHorn();
        }
        this.gameState.gameOver = true;
      }
    }

    // Check collisions with fake parking spots
    for (let fakeSpot of this.gameState.fakeParkingSpots) {
      if (
        this.p.abs(this.gameState.car.x - fakeSpot.x) < 25 &&
        this.p.abs(this.gameState.car.y - fakeSpot.y) < 20
      ) {
        if (!this.gameState.gameOver) {
          this.audioManager.playHorn();
        }
        this.gameState.gameOver = true;
      }
    }
  }

  public checkParking(): void {
    if (!this.gameState.car || !this.gameState.parkingSpot) return;

    const dx = this.p.abs(this.gameState.car.x - this.gameState.parkingSpot.x);
    const dy = this.p.abs(this.gameState.car.y - this.gameState.parkingSpot.y);
    const dAngle = this.p.abs(this.gameState.car.angle % (2 * this.p.PI));

    if (dx < 18 && dy < 18 && dAngle < 0.4) {
      if (!this.gameState.win) {
        this.audioManager.playWinSound();
      }
      this.gameState.win = true;
    }
  }

  private checkCollision(
    obj1: Car | Obstacle | Enemy | Boat,
    obj2: Car | Obstacle | Enemy | Boat
  ): boolean {
    const dx = this.p.abs(obj1.x - obj2.x);
    const dy = this.p.abs(obj1.y - obj2.y);
    const xLimit = obj1.w / 2 + obj2.w / 2;
    const yLimit = obj1.h / 2 + obj2.h / 2;

    return dx < xLimit && dy < yLimit;
  }

  public isGameActive(): boolean {
    return (
      !this.gameState.gameOver &&
      !this.gameState.win &&
      this.gameState.level <= config.max_levels
    );
  }
}
