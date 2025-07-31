import type p5 from "p5";
import type { ParkingSpot, Obstacle, Boat } from "./types";
import { GameStateManager } from "./GameState";

export class LevelGenerator {
  private p: p5;
  private gameState: GameStateManager;

  constructor(p: p5, gameState: GameStateManager) {
    this.p = p;
    this.gameState = gameState;
  }

  public generateLevel(level: number): void {
    // Reset level state
    this.gameState.resetLevel();

    // Generate parking spot
    this.gameState.parkingSpot = this.generateParkingSpot(level);

    // Generate fake parking spots
    this.generateFakeParkingSpots(level);

    // Generate obstacles
    for (let i = 0; i < 8 + level; i++) {
      this.gameState.obstacles.push(this.generateObstacle(i));
    }

    // Generate boats
    for (let i = 0; i < 3; i++) {
      this.gameState.boats.push(this.generateBoat());
    }

    // Generate enemies
    for (let i = 0; i < 2; i++) {
      this.gameState.enemies.push({
        x: -150 * (i + 1),
        y: 150 + i * 200,
        w: 48,
        h: 24,
        speed: 1.2 + level * 0.1,
        col: this.p.color(255, 50, 50),
      });
    }
  }

  private generateParkingSpot(level: number): ParkingSpot {
    const spots = [
      { x: 850, y: 150 },
      { x: 850, y: 250 },
      { x: 850, y: 350 },
      { x: 750, y: 120 },
      { x: 750, y: 220 },
      { x: 750, y: 320 },
      { x: 650, y: 150 },
      { x: 650, y: 250 },
      { x: 650, y: 350 },
      { x: 550, y: 180 },
      { x: 550, y: 280 },
    ];

    const spotIndex = (level - 1) % spots.length;
    const spot = spots[spotIndex];

    return {
      x: spot.x,
      y: spot.y,
      w: 40,
      h: 20,
    };
  }

  private generateFakeParkingSpots(level: number): void {
    this.gameState.fakeParkingSpots = [];

    const fakeSpots = [
      { x: 850, y: 200, angle: 0.3 },
      { x: 750, y: 180, angle: -0.2 },
      { x: 650, y: 200, angle: 0.4 },
      { x: 550, y: 220, angle: -0.3 },
      { x: 800, y: 300, angle: 0.1 },
      { x: 700, y: 280, angle: -0.4 },
      { x: 600, y: 300, angle: 0.2 },
      { x: 500, y: 320, angle: -0.1 },
    ];

    // Add fake spots based on level difficulty
    const numFakeSpots = Math.min(level + 1, fakeSpots.length);
    for (let i = 0; i < numFakeSpots; i++) {
      const fakeSpot = fakeSpots[i];
      this.gameState.fakeParkingSpots.push({
        x: fakeSpot.x,
        y: fakeSpot.y,
        w: 40,
        h: 20,
        angle: fakeSpot.angle,
      });
    }
  }

  private generateObstacle(index: number): Obstacle {
    const obstacleTypes: Array<"palm" | "lamp" | "car"> = [
      "palm",
      "lamp",
      "car",
    ];
    const type = obstacleTypes[index % obstacleTypes.length];

    let x: number, y: number, col: p5.Color;

    switch (type) {
      case "palm":
        x = this.p.random(200, 800);
        y = this.p.random(100, 400);
        col = this.p.color(0, 255, 0);
        break;
      case "lamp":
        x = this.p.random(150, 850);
        y = this.p.random(80, 450);
        col = this.p.color(255, 255, 0);
        break;
      case "car":
        x = this.p.random(100, 900);
        y = this.p.random(120, 480);
        col = this.p.color(100, 150, 255);
        break;
    }

    return {
      x: x,
      y: y,
      w: type === "car" ? 48 : 20,
      h: type === "car" ? 24 : 60,
      col: col,
      type: type,
    };
  }

  private generateBoat(): Boat {
    return {
      x: this.p.random(-200, -100),
      y: this.p.random(50, 150),
      w: 60,
      h: 30,
      speed: this.p.random(0.8, 1.5),
      col: this.p.color(
        this.p.random(100, 200),
        this.p.random(50, 150),
        this.p.random(200, 255)
      ),
      wave: this.p.random(0, this.p.TWO_PI),
    };
  }

  public resetCar(): void {
    this.gameState.car = {
      x: 120,
      y: 550,
      w: 48,
      h: 24,
      speed: 2.5,
      angle: 0,
    };
  }
}
