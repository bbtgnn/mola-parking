import type p5 from "p5";
import { ViewportManager } from "./ViewportManager";
import { config } from "./config";

export class UIManager {
  private p: p5;
  private viewport: ViewportManager;

  // P5.js-based text input state
  private playerName: string = "";
  private isInputActive: boolean = false;
  private showCursor: boolean = true;

  private onStartGameCallback: ((playerName: string) => void) | null = null;

  constructor(p: p5, viewport: ViewportManager) {
    this.p = p;
    this.viewport = viewport;

    // Setup cursor blinking
    setInterval(() => {
      this.showCursor = !this.showCursor;
    }, 500);
  }

  public createProductionUI(onStartGame: (playerName: string) => void): void {
    // Only create UI if not in development mode
    if (config.development && config.skip_home_if_dev) {
      return;
    }

    // Store the callback and activate input
    this.onStartGameCallback = onStartGame;
    this.isInputActive = true;
    this.playerName = "";
  }

  public removeUI(): void {
    // Reset input state
    this.isInputActive = false;
    this.playerName = "";
    this.onStartGameCallback = null;
  }

  // Draw the text input using p5.js
  public drawTextInput(): void {
    if (!this.isInputActive) return;

    // Input box position and size (in logical coordinates) - moved further down
    const inputX = this.viewport.logicalWidth / 2;
    const inputY = this.viewport.logicalHeight / 2 + 180;
    const inputWidth = 300;
    const inputHeight = 40;

    // Draw prompt above input box
    this.p.fill(0, 255, 0);
    this.p.noStroke();
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(18);
    this.p.text(
      "Inserisci il tuo nome e premi INVIO per iniziare",
      inputX,
      inputY - 35
    );

    // Draw input box background
    this.p.fill(20, 20, 20);
    this.p.stroke(0, 255, 0);
    this.p.strokeWeight(2);
    this.p.rectMode(this.p.CENTER);
    this.p.rect(inputX, inputY, inputWidth * 2, inputHeight);

    // Draw input text
    this.p.fill(0, 255, 0);
    this.p.noStroke();
    this.p.textAlign(this.p.LEFT, this.p.CENTER);
    this.p.textSize(16);

    const textX = inputX - inputWidth / 2 + 10;
    const displayText = this.playerName || "Inserisci il tuo nome...";
    const textColor = this.playerName ? [0, 255, 0] : [100, 100, 100];
    this.p.fill(textColor[0], textColor[1], textColor[2]);
    this.p.text(displayText, textX, inputY);

    // Draw blinking cursor
    if (this.playerName && this.showCursor) {
      const textWidth = this.p.textWidth(this.playerName);
      this.p.fill(0, 255, 0);
      this.p.rect(textX + textWidth + 2, inputY - 8, 2, 16);
    }

    // Draw START button
    this.drawStartButton(inputY + 50);
  }

  private drawStartButton(y: number): void {
    const buttonX = this.viewport.logicalWidth / 2;
    const buttonY = y;
    const buttonWidth = 150;
    const buttonHeight = 35;

    // Button is only enabled if name is entered
    const isEnabled = this.playerName.trim().length > 0;
    const bgColor = isEnabled ? [0, 100, 0] : [50, 50, 50];
    const borderColor = isEnabled ? [0, 255, 0] : [100, 100, 100];
    const textColor = isEnabled ? [0, 255, 0] : [150, 150, 150];

    // Draw button
    this.p.fill(bgColor[0], bgColor[1], bgColor[2]);
    this.p.stroke(borderColor[0], borderColor[1], borderColor[2]);
    this.p.strokeWeight(2);
    this.p.rectMode(this.p.CENTER);
    this.p.rect(buttonX, buttonY, buttonWidth, buttonHeight);

    // Draw button text
    this.p.fill(textColor[0], textColor[1], textColor[2]);
    this.p.noStroke();
    this.p.textAlign(this.p.CENTER, this.p.CENTER);
    this.p.textSize(18);
    this.p.text("START", buttonX, buttonY);
  }

  // Handle keyboard input
  public handleKeyPressed(): boolean {
    if (!this.isInputActive) return false;

    // Handle ENTER key to start game
    if (this.p.keyCode === this.p.ENTER) {
      if (this.playerName.trim().length > 0 && this.onStartGameCallback) {
        this.onStartGameCallback(this.playerName.trim());
        return true;
      }
      return false;
    }

    // Handle BACKSPACE
    if (this.p.keyCode === this.p.BACKSPACE) {
      this.playerName = this.playerName.slice(0, -1);
      return true;
    }

    // Handle regular characters
    if (this.p.key && this.p.key.length === 1 && this.playerName.length < 20) {
      // Only allow alphanumeric characters and spaces
      if (/[a-zA-Z0-9 ]/.test(this.p.key)) {
        this.playerName += this.p.key;
        return true;
      }
    }

    return false;
  }

  public isActive(): boolean {
    return this.isInputActive;
  }
}
