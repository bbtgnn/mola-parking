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

    // Generate parking spot first (needed for collision detection)
    this.gameState.parkingSpot = this.generateParkingSpot(level);

    // Generate fake parking spots (with overlap detection)
    this.generateFakeParkingSpots(level);

    // Generate obstacles (with collision detection to prevent overlapping)
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

    const fakeSpotTemplates = [
      { x: 850, y: 200, angle: 0.3 },
      { x: 750, y: 180, angle: -0.2 },
      { x: 650, y: 200, angle: 0.4 },
      { x: 550, y: 220, angle: -0.3 },
      { x: 800, y: 300, angle: 0.1 },
      { x: 700, y: 280, angle: -0.4 },
      { x: 600, y: 300, angle: 0.2 },
      { x: 500, y: 320, angle: -0.1 },
    ];

    // Add fake spots based on level difficulty, ensuring no overlap with real parking spot
    const numFakeSpots = Math.min(level + 1, fakeSpotTemplates.length);
    for (let i = 0; i < numFakeSpots; i++) {
      const template = fakeSpotTemplates[i];

      // Check if this fake spot would overlap with the real parking spot
      const wouldOverlap =
        this.gameState.parkingSpot &&
        this.rectanglesOverlap(
          template.x,
          template.y,
          40,
          20,
          this.gameState.parkingSpot.x,
          this.gameState.parkingSpot.y,
          this.gameState.parkingSpot.w,
          this.gameState.parkingSpot.h
        );

      // Only add the fake spot if it doesn't overlap with the real parking spot
      if (!wouldOverlap) {
        this.gameState.fakeParkingSpots.push({
          x: template.x,
          y: template.y,
          w: 40,
          h: 20,
          angle: template.angle,
        });
      }
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
    let w: number, h: number;
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loops

    // Set obstacle dimensions and color based on type
    switch (type) {
      case "palm":
        w = 20;
        h = 60;
        col = this.p.color(0, 255, 0);
        break;
      case "lamp":
        w = 20;
        h = 60;
        col = this.p.color(255, 255, 0);
        break;
      case "car":
        w = 48;
        h = 24;
        col = this.p.color(100, 150, 255);
        break;
    }

    // Keep trying to place obstacle until we find a valid position
    do {
      switch (type) {
        case "palm":
          x = this.p.random(200, 800);
          y = this.p.random(100, 400);
          break;
        case "lamp":
          x = this.p.random(150, 850);
          y = this.p.random(80, 450);
          break;
        case "car":
          x = this.p.random(100, 900);
          y = this.p.random(120, 480);
          break;
      }
      attempts++;
    } while (this.checkObstacleOverlap(x, y, w, h) && attempts < maxAttempts);

    return {
      x: x,
      y: y,
      w: w,
      h: h,
      col: col,
      type: type,
    };
  }

  // Helper method to check if an obstacle would overlap with parking spot or other obstacles
  private checkObstacleOverlap(
    x: number,
    y: number,
    w: number,
    h: number
  ): boolean {
    // Check overlap with parking spot
    if (this.gameState.parkingSpot) {
      const parkingSpot = this.gameState.parkingSpot;
      if (
        this.rectanglesOverlap(
          x,
          y,
          w,
          h,
          parkingSpot.x,
          parkingSpot.y,
          parkingSpot.w,
          parkingSpot.h
        )
      ) {
        return true;
      }
    }

    // Check overlap with existing obstacles
    for (const obstacle of this.gameState.obstacles) {
      if (
        this.rectanglesOverlap(
          x,
          y,
          w,
          h,
          obstacle.x,
          obstacle.y,
          obstacle.w,
          obstacle.h
        )
      ) {
        return true;
      }
    }

    // Check overlap with fake parking spots
    for (const fakeSpot of this.gameState.fakeParkingSpots) {
      if (
        this.rectanglesOverlap(
          x,
          y,
          w,
          h,
          fakeSpot.x,
          fakeSpot.y,
          fakeSpot.w,
          fakeSpot.h
        )
      ) {
        return true;
      }
    }

    return false;
  }

  // Helper method to check if two rectangles overlap
  private rectanglesOverlap(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ): boolean {
    // Add some padding to ensure proper spacing
    const padding = 15;

    const left1 = x1 - w1 / 2 - padding;
    const right1 = x1 + w1 / 2 + padding;
    const top1 = y1 - h1 / 2 - padding;
    const bottom1 = y1 + h1 / 2 + padding;

    const left2 = x2 - w2 / 2;
    const right2 = x2 + w2 / 2;
    const top2 = y2 - h2 / 2;
    const bottom2 = y2 + h2 / 2;

    return !(
      right1 < left2 ||
      left1 > right2 ||
      bottom1 < top2 ||
      top1 > bottom2
    );
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
