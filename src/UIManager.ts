import type p5 from "p5";
import { config } from "./config";

export class UIManager {
  private p: p5;
  private nameInput: p5.Element | null = null;
  private playButton: p5.Element | null = null;

  constructor(p: p5) {
    this.p = p;
  }

  public createProductionUI(onStartGame: (playerName: string) => void): void {
    // Only create UI if not in development mode
    if (config.development && config.skip_home_if_dev) {
      return;
    }

    this.nameInput = this.p.createInput("");
    this.nameInput.position(this.p.width / 2 - 100, this.p.height / 2 + 50);
    this.nameInput.size(200);
    this.nameInput.attribute("placeholder", "Nome Pilota");
    this.styleInput(this.nameInput);

    this.playButton = this.p.createButton("START");
    this.playButton.position(this.p.width / 2 - 60, this.p.height / 2 + 100);
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
