import type p5 from "p5";
import type { Obstacle, Enemy } from "./types";
import { GameStateManager } from "./GameState";
import { config } from "./config";

export class Renderer {
  private p: p5;
  private gameState: GameStateManager;

  constructor(p: p5, gameState: GameStateManager) {
    this.p = p;
    this.gameState = gameState;
  }

  // Main rendering methods
  public drawMenu(): void {
    this.p.fill(255, 255, 0);
    this.p.stroke(255, 255, 0);
    this.p.strokeWeight(2);
    this.p.textSize(60);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.text("MOLESTO", this.p.width / 2, this.p.height / 2 - 150);

    this.p.fill(0, 255, 0);
    this.p.noStroke();
    this.p.textSize(24);
    this.p.text(
      "Il diritto al posto negato",
      this.p.width / 2,
      this.p.height / 2 - 100
    );

    this.p.fill(255, 255, 0);
    this.p.textSize(18);
    this.p.text("REGOLE DEL GIOOCO ", this.p.width / 2, this.p.height / 2 - 70);
    this.p.textSize(15);
    this.p.text(
      "OBBIETTIVO: Parcheggia nel posto GIALLO",
      this.p.width / 2,
      this.p.height / 2 - 50
    );
    this.p.text(
      "Evita i parcheggi ROSSI (sono finti!)",
      this.p.width / 2,
      this.p.height / 2 - 30
    );
    this.p.text(
      "Schiva barche e auto nemiche",
      this.p.width / 2,
      this.p.height / 2 - 10
    );
    this.p.text(
      "Usa le frecce per muoverti",
      this.p.width / 2,
      this.p.height / 2 + 10
    );
    this.p.text(
      "SOLO CHI VINCE PUO DECIDERE!",
      this.p.width / 2,
      this.p.height / 2 + 35
    );
  }

  public drawCastle(): void {
    let cx = this.p.width / 2;
    let cy = this.p.height / 2 - 50;

    this.p.push();
    this.p.translate(cx, cy);
    this.p.noStroke();

    this.p.fill(64);
    this.p.rect(-70, -20, 140, 60);

    this.p.fill(96);
    this.p.rect(-65, -15, 20, 10);
    this.p.rect(-40, -15, 20, 10);
    this.p.rect(-15, -15, 20, 10);
    this.p.rect(10, -15, 20, 10);
    this.p.rect(35, -15, 20, 10);

    this.p.fill(80);
    this.p.rect(-90, -50, 30, 70);
    this.p.fill(112);
    this.p.rect(-85, -45, 8, 8);
    this.p.rect(-75, -45, 8, 8);
    this.p.rect(-85, -30, 8, 8);
    this.p.rect(-75, -30, 8, 8);

    this.p.fill(96);
    this.p.rect(-90, -58, 6, 8);
    this.p.rect(-78, -58, 6, 8);
    this.p.rect(-66, -58, 6, 8);

    this.p.fill(80);
    this.p.rect(60, -50, 30, 70);
    this.p.fill(112);
    this.p.rect(65, -45, 8, 8);
    this.p.rect(75, -45, 8, 8);
    this.p.rect(65, -30, 8, 8);
    this.p.rect(75, -30, 8, 8);

    this.p.fill(96);
    this.p.rect(60, -58, 6, 8);
    this.p.rect(72, -58, 6, 8);
    this.p.rect(84, -58, 6, 8);

    this.p.fill(128);
    this.p.rect(-25, -70, 50, 90);
    this.p.fill(160);
    this.p.rect(-20, -65, 8, 8);
    this.p.rect(-8, -65, 8, 8);
    this.p.rect(4, -65, 8, 8);
    this.p.rect(16, -65, 8, 8);
    this.p.fill(96);
    this.p.rect(-20, -50, 8, 8);
    this.p.rect(16, -50, 8, 8);
    this.p.rect(-20, -35, 8, 8);
    this.p.rect(16, -35, 8, 8);

    this.p.fill(144);
    this.p.rect(-25, -78, 8, 8);
    this.p.rect(-12, -78, 8, 8);
    this.p.rect(1, -78, 8, 8);
    this.p.rect(14, -78, 8, 8);

    this.p.fill(32);
    this.p.rect(-12, 10, 24, 30);
    this.p.fill(48);
    this.p.rect(-10, 15, 4, 4);
    this.p.rect(-2, 15, 4, 4);
    this.p.rect(6, 15, 4, 4);

    this.p.fill(64, 32, 0);
    this.p.rect(-15, 35, 30, 8);
    this.p.pop();
  }

  public drawFakeParkingSpots(): void {
    for (let i = 0; i < this.gameState.fakeParkingSpots.length; i++) {
      let spot = this.gameState.fakeParkingSpots[i];
      this.p.push();
      this.p.translate(spot.x, spot.y);
      this.p.rotate(spot.angle);
      this.p.rectMode(this.p.CENTER);
      this.p.stroke(255, 0, 0);
      this.p.strokeWeight(3);
      this.p.fill(80, 0, 0);
      this.p.rect(0, 0, spot.w, spot.h);
      this.p.noStroke();
      this.p.fill(255, 0, 0);
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.textSize(16);
      this.p.text("X", 0, 0);
      this.p.pop();
    }
  }

  public drawParkingSpot(): void {
    if (!this.gameState.parkingSpot) return;
    this.p.push();
    this.p.translate(
      this.gameState.parkingSpot.x,
      this.gameState.parkingSpot.y
    );
    this.p.rectMode(this.p.CENTER);
    let pulse = this.p.sin(this.p.frameCount * 0.1) * 50 + 205;
    this.p.stroke(255, pulse, 0);
    this.p.strokeWeight(4);
    this.p.fill(100, 100, 0);
    this.p.rect(
      0,
      0,
      this.gameState.parkingSpot.w,
      this.gameState.parkingSpot.h
    );
    this.p.noStroke();
    this.p.fill(255, 255, 0);
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(24);
    this.p.text("P", 0, 0);
    this.p.pop();
  }

  public drawCar(): void {
    if (!this.gameState.car) return;
    this.p.push();
    this.p.translate(this.gameState.car.x, this.gameState.car.y);
    this.p.rotate(this.gameState.car.angle);
    this.p.rectMode(this.p.CENTER);
    this.p.stroke(0, 255, 0);
    this.p.strokeWeight(2);
    this.p.fill(255);
    this.p.rect(0, 0, this.gameState.car.w, this.gameState.car.h);
    this.p.noStroke();
    this.p.fill(100, 150, 255);
    this.p.rect(0, -4, 28, 12);
    this.p.fill(40);
    this.p.rect(-this.gameState.car.w / 2 + 8, -this.gameState.car.h / 2, 8, 6);
    this.p.rect(this.gameState.car.w / 2 - 8, -this.gameState.car.h / 2, 8, 6);
    this.p.rect(-this.gameState.car.w / 2 + 8, this.gameState.car.h / 2, 8, 6);
    this.p.rect(this.gameState.car.w / 2 - 8, this.gameState.car.h / 2, 8, 6);
    this.p.fill(255, 255, 0);
    this.p.rect(this.gameState.car.w / 2 + 2, -this.gameState.car.h / 4, 4, 4);
    this.p.rect(this.gameState.car.w / 2 + 2, this.gameState.car.h / 4, 4, 4);
    this.p.pop();
  }

  public drawEnemies(): void {
    for (let i = 0; i < this.gameState.enemies.length; i++) {
      this.drawPixelCar(this.gameState.enemies[i], true);
    }
  }

  public drawObstacles(): void {
    for (let obs of this.gameState.obstacles) {
      if (obs.type === "palm") this.drawPalm(obs.x, obs.y);
      else if (obs.type === "lamp") this.drawLamp(obs.x, obs.y);
      else this.drawPixelCar(obs, false);
    }
  }

  public drawBoats(): void {
    for (let boat of this.gameState.boats) {
      this.p.push();
      this.p.translate(
        boat.x,
        boat.y + this.p.sin(boat.wave + this.p.frameCount * 0.1) * 3
      );
      this.p.stroke(0, 255, 255);
      this.p.strokeWeight(2);
      this.p.fill(boat.col);
      this.p.ellipse(0, 0, boat.w, boat.h);
      this.p.noStroke();
      this.p.fill(255);
      this.p.triangle(-5, -15, 5, -25, 15, -5);
      this.p.fill(139, 69, 19);
      this.p.rect(-2, -25, 4, 25);
      this.p.pop();
    }
  }

  public drawUI(): void {
    this.p.fill(0);
    this.p.stroke(255, 255, 0);
    this.p.strokeWeight(2);
    this.p.rect(0, 0, this.p.width, 60);
    this.p.fill(255, 255, 0);
    this.p.noStroke();
    this.p.textSize(18);
    this.p.textAlign(this.p.LEFT);
    this.p.text("LIVELLO: " + this.gameState.level, 20, 25);
    this.p.text("PLAYER: " + this.gameState.playerName, 20, 45);

    // Development mode indicator
    if (config.development) {
      this.p.fill(255, 0, 0);
      this.p.textSize(12);
      this.p.text("DEV MODE", 20, 55);
    }

    this.p.textAlign(this.p.RIGHT);
    this.p.text("MOLA ARCADE", this.p.width - 20, 25);
  }

  public drawMessages(): void {
    this.p.textAlign(this.p.CENTER);
    if (this.gameState.win && this.gameState.level <= 10) {
      this.p.fill(0, 255, 0);
      this.p.stroke(0, 255, 0);
      this.p.strokeWeight(2);
      this.p.textSize(24);
      this.p.text("PARCHEGGIO RIUSCITO! Premi N", this.p.width / 2, 100);
    }
    if (this.gameState.isGameComplete()) {
      this.p.fill(255, 255, 0);
      this.p.stroke(255, 255, 0);
      this.p.strokeWeight(2);
      this.p.textSize(32);
      this.p.text("VITTORIA TOTALE!", this.p.width / 2, this.p.height / 2);
      this.p.noStroke();
      this.p.textSize(20);
      this.p.text(
        "Complimenti " + this.gameState.playerName + "!",
        this.p.width / 2,
        this.p.height / 2 + 40
      );
    }
    if (this.gameState.gameOver) {
      this.p.fill(255, 0, 0);
      this.p.stroke(255, 0, 0);
      this.p.strokeWeight(2);
      this.p.textSize(24);
      this.p.text("GAME OVER! Premi R", this.p.width / 2, 100);
    }
  }

  // Helper drawing methods
  private drawPalm(x: number, y: number): void {
    this.p.push();
    this.p.translate(x, y);
    this.p.noStroke();
    this.p.fill(101, 67, 33);
    this.p.rect(-5, -30, 10, 60);
    this.p.fill(0, 255, 0);
    this.p.ellipse(0, -40, 40, 20);
    this.p.ellipse(-15, -35, 30, 15);
    this.p.ellipse(15, -35, 30, 15);
    this.p.pop();
  }

  private drawLamp(x: number, y: number): void {
    this.p.push();
    this.p.translate(x, y);
    this.p.noStroke();
    this.p.fill(128);
    this.p.rect(-3, -40, 6, 70);
    this.p.fill(255, 255, 0);
    this.p.ellipse(0, -42, 16, 16);
    this.p.pop();
  }

  private drawPixelCar(obj: Obstacle | Enemy, isEnemy: boolean): void {
    this.p.push();
    this.p.translate(obj.x, obj.y);
    this.p.rectMode(this.p.CENTER);
    this.p.stroke(
      isEnemy ? this.p.color(255, 0, 0) : this.p.color(0, 255, 255)
    );
    this.p.strokeWeight(2);
    this.p.fill(obj.col);
    this.p.rect(0, 0, obj.w, obj.h);
    this.p.noStroke();
    this.p.fill(
      isEnemy ? this.p.color(255, 100, 100) : this.p.color(100, 150, 255)
    );
    this.p.rect(0, -obj.h * 0.15, obj.w * 0.6, obj.h * 0.4);
    this.p.fill(40);
    this.p.rect(-obj.w / 2 + 6, -obj.h / 2 + 2, 8, 6);
    this.p.rect(obj.w / 2 - 6, -obj.h / 2 + 2, 8, 6);
    this.p.rect(-obj.w / 2 + 6, obj.h / 2 - 2, 8, 6);
    this.p.rect(obj.w / 2 - 6, obj.h / 2 - 2, 8, 6);
    this.p.fill(isEnemy ? this.p.color(255, 0, 0) : this.p.color(255, 255, 0));
    this.p.rect(obj.w / 2 - 2, -obj.h / 4, 4, 4);
    this.p.rect(obj.w / 2 - 2, obj.h / 4, 4, 4);
    if (isEnemy) {
      this.p.fill(255, 0, 0);
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.textSize(12);
      this.p.text("!", 0, -obj.h / 3);
    }
    this.p.pop();
  }
}
