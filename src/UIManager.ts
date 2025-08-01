import type p5 from "p5";
import { ViewportManager } from "./ViewportManager";
import { config } from "./config";

export class UIManager {
  private p: p5;
  private viewport: ViewportManager;
  private nameInput: p5.Element | null = null;
  private playButton: p5.Element | null = null;

  constructor(p: p5, viewport: ViewportManager) {
    this.p = p;
    this.viewport = viewport;
  }

  public createProductionUI(onStartGame: (playerName: string) => void): void {
    // Only create UI if not in development mode
    if (config.development && config.skip_home_if_dev) {
      return;
    }

    // Convert logical UI positions to actual screen coordinates
    const inputLogicalPos = this.viewport.logicalToActual(
      this.viewport.logicalWidth / 2 - 100,
      this.viewport.logicalHeight / 2 + 50
    );
    const buttonLogicalPos = this.viewport.logicalToActual(
      this.viewport.logicalWidth / 2 - 60,
      this.viewport.logicalHeight / 2 + 100
    );

    this.nameInput = this.p.createInput("");
    this.nameInput.position(inputLogicalPos.x, inputLogicalPos.y);
    this.nameInput.size(200 * this.viewport.scale); // Scale input size with viewport
    this.nameInput.attribute("placeholder", "Nome Pilota");
    this.styleInput(this.nameInput);

    this.playButton = this.p.createButton("START");
    this.playButton.position(buttonLogicalPos.x, buttonLogicalPos.y);
    this.styleButton(this.playButton);
    this.playButton.mousePressed(() => {
      if (this.nameInput) {
        onStartGame((this.nameInput as any).value());
      }
    });
  }

  public removeUI(): void {
    if (this.nameInput) {
      this.nameInput.remove();
      this.nameInput = null;
    }
    if (this.playButton) {
      this.playButton.remove();
      this.playButton = null;
    }
  }

  private styleInput(el: p5.Element): void {
    el.style("background", "#111");
    el.style("border", "2px solid #00FF00");
    el.style("color", "#00FF00");
    el.style("padding", "8px");
    el.style("font-family", "Monaco, monospace");
  }

  private styleButton(el: p5.Element): void {
    el.style("background", "#000");
    el.style("border", "2px solid #00FF00");
    el.style("color", "#00FF00");
    el.style("padding", "10px 20px");
    el.style("font-family", "Monaco, monospace");
    el.style("font-size", "16px");
    el.style("cursor", "pointer");
  }
}
