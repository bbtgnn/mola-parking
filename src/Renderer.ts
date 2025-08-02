import type p5 from "p5";
import type { Obstacle, Enemy } from "./types";
import { GameStateManager } from "./GameState";
import { ViewportManager } from "./ViewportManager";
import { UIManager } from "./UIManager";
import { config } from "./config";

export class Renderer {
  private p: p5;
  private gameState: GameStateManager;
  private viewport: ViewportManager;
  private uiManager: UIManager;
  private castleImage: p5.Image | null = null;

  private uiFontSize: number = 20;
  private uiFontColor: number = 255;

  constructor(
    p: p5,
    gameState: GameStateManager,
    viewport: ViewportManager,
    uiManager: UIManager
  ) {
    this.p = p;
    this.gameState = gameState;
    this.viewport = viewport;
    this.uiManager = uiManager;
  }

  // Method to set the castle image after it's loaded
  public setCastleImage(image: p5.Image | null): void {
    this.castleImage = image;
  }

  // Viewport transformation methods
  public applyGameTransform(): void {
    this.viewport.applyGameTransform();
  }

  public applyGameTransformWithClip(): void {
    this.viewport.applyGameTransformWithClip();
  }

  public resetTransform(): void {
    this.viewport.resetTransform();
  }

  public resetTransformWithClip(): void {
    this.viewport.resetTransformWithClip();
  }

  // Main rendering methods
  public drawMenu(): void {
    this.p.fill(255, 255, 0);
    this.p.noStroke();
    this.p.textAlign(this.p.CENTER);
    this.p.textSize(60);

    this.p.text(
      "MOL-E-STO",
      this.viewport.logicalWidth / 2,
      this.viewport.logicalHeight / 2 - 150
    );

    this.p.fill(0, 255, 0);
    this.p.noStroke();
    this.p.textSize(24);
    this.p.text(
      "Il diritto al posto negato",
      this.viewport.logicalWidth / 2,
      this.viewport.logicalHeight / 2 - 100
    );

    this.p.textSize(15);
    this.p.fill(255, 255, 0);
    const rulesText =
      "REGOLE DEL GIOCO\n" +
      "-\n" +
      "OBBIETTIVO: Parcheggia nel posto GIALLO\n" +
      "Evita i parcheggi ROSSI (sono finti!)\n" +
      "Schiva barche e auto nemiche\n" +
      "Usa le frecce per muoverti\n" +
      "SOLO CHI VINCE PUO DECIDERE!";
    this.p.text(
      rulesText,
      this.viewport.logicalWidth / 2,
      this.viewport.logicalHeight / 2 - 50
    );

    // Draw the text input if UI is active
    this.uiManager.drawTextInput();
  }

  public drawCastle(): void {
    // Position castle in perfect center of the playable game area (excluding toolbar)
    let cx = this.viewport.logicalWidth / 2;
    let gameAreaHeight = this.viewport.logicalHeight - this.topbarHeight;
    let cy = this.topbarHeight + gameAreaHeight / 2;

    if (this.castleImage) {
      // Use the SVG image (300x100)
      this.p.push();

      // Scale down the castle to fit better in the game (original is 300x100)
      const scale = 1; // Adjust this to make castle smaller/larger
      const scaledW = 300 * scale; // 180
      const scaledH = 100 * scale; // 60

      // Draw the image centered at the castle position
      this.p.imageMode(this.p.CENTER);
      this.p.image(this.castleImage, cx, cy, scaledW, scaledH);
      this.p.pop();
    } else {
      // Fallback: draw a simple rectangle if image fails to load
      this.p.push();
      this.p.translate(cx, cy);
      this.p.noStroke();
      this.p.fill(128, 128, 128);
      this.p.rectMode(this.p.CENTER);
      this.p.rect(0, 0, 180, 60);
      this.p.fill(64, 64, 64);
      this.p.rect(0, 0, 160, 40);

      // Debug text to show fallback is being used
      this.p.fill(255, 255, 255);
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.textSize(12);
      this.p.text("Castle Loading...", 0, 0);
      this.p.pop();
    }
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

  private topbarHeight = this.uiFontSize * 3;

  public drawUI(): void {
    // Background
    this.p.noStroke();
    this.p.fill(...config.letterbox_color);
    this.p.rect(0, 0, this.viewport.logicalWidth, this.topbarHeight);

    this.p.noStroke();
    this.p.fill(this.uiFontColor);
    this.p.textSize(this.uiFontSize);
    this.p.textLeading(this.uiFontSize * 1.5);

    this.p.textAlign(this.p.LEFT);
    this.p.text(
      `LIVELLO - ${this.gameState.level}\nPLAYER - ${this.gameState.playerName}`,
      0,
      this.uiFontSize
    );

    this.p.textAlign(this.p.RIGHT);
    this.p.text(
      "MOL-E-STO\nARCADE",
      this.viewport.logicalWidth,
      this.uiFontSize
    );
  }

  public drawDevUI(): void {
    if (!config.show_dev_ui) return;

    // Dev panel background
    this.p.push();
    this.p.fill(0, 0, 0, 150);
    this.p.noStroke();
    this.p.rect(10, 10, 320, 320);

    // Dev panel content
    this.p.fill(0, 255, 0);
    this.p.textAlign(this.p.LEFT, this.p.TOP);
    this.p.textSize(14);

    let yPos = 25;
    const lineHeight = 18;

    this.p.text("🛠️ DEV MODE", 20, yPos);
    yPos += lineHeight * 1.5;

    this.p.fill(255);
    this.p.textSize(12);

    // Game state info
    this.p.text(`State: ${this.gameState.gameState}`, 20, yPos);
    yPos += lineHeight;
    this.p.text(`Level: ${this.gameState.level}`, 20, yPos);
    yPos += lineHeight;
    this.p.text(`Player: ${this.gameState.playerName}`, 20, yPos);
    yPos += lineHeight;

    // Game objects count
    this.p.text(`Obstacles: ${this.gameState.obstacles.length}`, 20, yPos);
    yPos += lineHeight;
    this.p.text(`Enemies: ${this.gameState.enemies.length}`, 20, yPos);
    yPos += lineHeight;
    this.p.text(`Boats: ${this.gameState.boats.length}`, 20, yPos);
    yPos += lineHeight;
    this.p.text(
      `Fake Spots: ${this.gameState.fakeParkingSpots.length}`,
      20,
      yPos
    );
    yPos += lineHeight;

    // Audio status
    const audioStatus = config.disable_audio_in_dev ? "DISABLED" : "ENABLED";
    this.p.text(`Audio: ${audioStatus}`, 20, yPos);
    yPos += lineHeight;

    // Car position (if car exists)
    if (this.gameState.car) {
      this.p.text(
        `Car: (${Math.round(this.gameState.car.x)}, ${Math.round(
          this.gameState.car.y
        )})`,
        20,
        yPos
      );
    } else {
      this.p.text("Car: NOT INITIALIZED", 20, yPos);
    }
    yPos += lineHeight;

    // Viewport info
    this.p.fill(100, 255, 255);
    this.p.textSize(11);
    this.p.text("🖥️ VIEWPORT:", 20, yPos);
    yPos += lineHeight;

    this.p.fill(200);
    this.p.textSize(10);
    this.p.text(
      `Screen: ${this.viewport.actualWidth}×${this.viewport.actualHeight}`,
      20,
      yPos
    );
    yPos += lineHeight * 0.8;
    this.p.text(`Scale: ${Math.round(this.viewport.scale * 100)}%`, 20, yPos);
    yPos += lineHeight * 0.8;
    this.p.text(
      `Type: ${
        this.viewport.offsetX > 0
          ? "Pillarbox"
          : this.viewport.offsetY > 0
          ? "Letterbox"
          : "Perfect fit"
      }`,
      20,
      yPos
    );
    yPos += lineHeight * 1.2;

    // Keyboard shortcuts
    this.p.fill(255, 255, 0);
    this.p.textSize(11);
    this.p.text("⌨️ SHORTCUTS:", 20, yPos);
    yPos += lineHeight;

    this.p.fill(200);
    this.p.textSize(10);
    this.p.text("D - Toggle Dev UI", 20, yPos);
    yPos += lineHeight * 0.8;
    this.p.text("A - Toggle Audio", 20, yPos);
    yPos += lineHeight * 0.8;
    this.p.text("R - Restart Level", 20, yPos);
    yPos += lineHeight * 0.8;
    this.p.text("N - Next Level", 20, yPos);

    this.p.pop();
  }

  public drawMessages(): void {
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    const messageFontSize = 24;

    // Calculate game area dimensions (excluding toolbar)
    const gameAreaWidth = this.viewport.logicalWidth;
    const gameAreaHeight = this.viewport.logicalHeight - this.topbarHeight;
    const gameAreaTop = this.topbarHeight;
    const gameAreaCenterY = gameAreaTop + gameAreaHeight / 2;

    const drawOverlay = () => {
      // Draw full-area light blue overlay background
      const bg = config.game_background_color;
      this.p.fill(bg[0], bg[1], bg[2], 150); // Light blue with 150/255 opacity
      this.p.noStroke();
      this.p.rectMode(this.p.CORNER);
      this.p.rect(0, gameAreaTop, gameAreaWidth, gameAreaHeight);
    };

    if (this.gameState.win && this.gameState.level <= 10) {
      drawOverlay();
      // Draw text
      this.p.fill(0, 255, 0);
      this.p.textSize(messageFontSize);
      this.p.text(
        "PARCHEGGIO RIUSCITO!\nPremi [N] per il livello successivo",
        this.viewport.logicalWidth / 2,
        gameAreaCenterY
      );
    }

    if (this.gameState.isGameComplete()) {
      drawOverlay();
      // Draw victory text
      this.p.fill(255, 255, 0);
      this.p.textSize(32);
      this.p.text(
        "VITTORIA TOTALE!",
        this.viewport.logicalWidth / 2,
        gameAreaCenterY - 20
      );

      this.p.textSize(20);
      this.p.text(
        "Complimenti " + this.gameState.playerName + "!",
        this.viewport.logicalWidth / 2,
        gameAreaCenterY + 20
      );
    }

    if (this.gameState.gameOver) {
      drawOverlay();
      // Draw game over text
      this.p.fill(255, 0, 0);
      this.p.textSize(messageFontSize);
      this.p.text(
        "GAME OVER!\nPremi [R] per riprovare il livello",
        this.viewport.logicalWidth / 2,
        gameAreaCenterY
      );
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
