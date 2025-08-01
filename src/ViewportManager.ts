import type p5 from "p5";
import { config } from "./config";

export class ViewportManager {
  // Logical (game) dimensions - fixed 4:3 aspect ratio
  public readonly logicalWidth = 1000;
  public readonly logicalHeight = 750; // 1000 ÷ 750 = 4:3 ratio
  public readonly aspectRatio = this.logicalWidth / this.logicalHeight; // 1.33 (4:3)

  // Actual screen dimensions
  public actualWidth: number = 0;
  public actualHeight: number = 0;

  // Scaling and positioning
  public scale: number = 1;
  public offsetX: number = 0;
  public offsetY: number = 0;
  public scaledWidth: number = 0;
  public scaledHeight: number = 0;

  private p: p5;

  constructor(p: p5) {
    this.p = p;
    this.updateViewport();
  }

  public updateViewport(): void {
    // Get actual browser dimensions
    this.actualWidth = window.innerWidth;
    this.actualHeight = window.innerHeight;

    // Calculate available space accounting for minimum margin
    const availableWidth = this.actualWidth - config.min_margin_pixels * 2;
    const availableHeight = this.actualHeight - config.min_margin_pixels * 2;

    // Calculate uniform scale to maintain aspect ratio within available space
    const scaleX = availableWidth / this.logicalWidth;
    const scaleY = availableHeight / this.logicalHeight;

    // Use the smaller scale to ensure the entire game fits with margin
    this.scale = Math.min(scaleX, scaleY);

    // Calculate scaled dimensions
    this.scaledWidth = this.logicalWidth * this.scale;
    this.scaledHeight = this.logicalHeight * this.scale;

    // Calculate centering offsets (letterbox/pillarbox)
    this.offsetX = (this.actualWidth - this.scaledWidth) / 2;
    this.offsetY = (this.actualHeight - this.scaledHeight) / 2;

    // Resize canvas to fill entire browser window
    this.p.resizeCanvas(this.actualWidth, this.actualHeight);

    console.log(
      `🖥️ Viewport updated: ${this.actualWidth}×${
        this.actualHeight
      }, scale: ${this.scale.toFixed(2)}, offset: (${this.offsetX.toFixed(
        0
      )}, ${this.offsetY.toFixed(0)})`
    );
  }

  // Convert logical coordinates to actual screen coordinates
  public logicalToActual(
    logicalX: number,
    logicalY: number
  ): { x: number; y: number } {
    return {
      x: logicalX * this.scale + this.offsetX,
      y: logicalY * this.scale + this.offsetY,
    };
  }

  // Convert actual screen coordinates to logical coordinates
  public actualToLogical(
    actualX: number,
    actualY: number
  ): { x: number; y: number } {
    return {
      x: (actualX - this.offsetX) / this.scale,
      y: (actualY - this.offsetY) / this.scale,
    };
  }

  // Check if actual coordinates are within the game area
  public isInGameArea(actualX: number, actualY: number): boolean {
    return (
      actualX >= this.offsetX &&
      actualX <= this.offsetX + this.scaledWidth &&
      actualY >= this.offsetY &&
      actualY <= this.offsetY + this.scaledHeight
    );
  }

  // Setup coordinate transformation for rendering game objects
  public applyGameTransform(): void {
    this.p.push();
    this.p.translate(this.offsetX, this.offsetY);
    this.p.scale(this.scale);
  }

  // Reset transformation
  public resetTransform(): void {
    this.p.pop();
  }

  // Draw letterbox/pillarbox bars and game background
  public drawLetterbox(): void {
    this.p.push();
    this.p.noStroke();

    // Draw letterbox/pillarbox bars with configured color
    const [lr, lg, lb] = config.letterbox_color;
    this.p.fill(lr, lg, lb);

    // Horizontal letterbox bars (top and bottom)
    if (this.offsetY > 0) {
      this.p.rect(0, 0, this.actualWidth, this.offsetY); // Top bar
      this.p.rect(
        0,
        this.offsetY + this.scaledHeight,
        this.actualWidth,
        this.offsetY
      ); // Bottom bar
    }

    // Vertical pillarbox bars (left and right)
    if (this.offsetX > 0) {
      this.p.rect(0, 0, this.offsetX, this.actualHeight); // Left bar
      this.p.rect(
        this.offsetX + this.scaledWidth,
        0,
        this.offsetX,
        this.actualHeight
      ); // Right bar
    }

    this.p.pop();
  }

  // Draw game area background
  public drawGameBackground(): void {
    this.p.push();

    // Draw game background with configured color
    const [gr, gg, gb] = config.game_background_color;
    this.p.fill(gr, gg, gb);
    this.p.noStroke();

    // Draw game area background
    this.p.rect(
      this.offsetX,
      this.offsetY,
      this.scaledWidth,
      this.scaledHeight
    );

    this.p.pop();
  }

  // Get scaling info for debugging
  public getScalingInfo(): string {
    const scalePercent = Math.round(this.scale * 100);
    const type =
      this.offsetX > 0
        ? "pillarbox"
        : this.offsetY > 0
        ? "letterbox"
        : "perfect fit";
    return `${scalePercent}% scale, ${type}`;
  }
}
