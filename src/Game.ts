import type p5 from "p5";
import { GameStateManager } from "./GameState";
import { Renderer } from "./Renderer";
import { AudioManager } from "./AudioManager";
import { LevelGenerator } from "./LevelGenerator";
import { MovementManager } from "./MovementManager";
import { CollisionManager } from "./CollisionManager";
import { InputManager } from "./InputManager";
import { GameLogicManager } from "./GameLogicManager";
import { UIManager } from "./UIManager";
import { ViewportManager } from "./ViewportManager";

export class Game {
  private p: p5;
  private gameState: GameStateManager;
  private renderer: Renderer;
  private audioManager: AudioManager;
  private levelGenerator: LevelGenerator;
  private movementManager: MovementManager;
  private collisionManager: CollisionManager;
  private inputManager: InputManager;
  private gameLogic: GameLogicManager;
  private uiManager: UIManager;
  private viewport: ViewportManager;
  private font: p5.Font | null = null;

  constructor(p: p5) {
    this.p = p;

    // Initialize viewport manager first
    this.viewport = new ViewportManager(p);

    // Initialize all managers
    this.gameState = new GameStateManager();
    this.audioManager = new AudioManager();
    this.uiManager = new UIManager(p, this.viewport);
    this.renderer = new Renderer(
      p,
      this.gameState,
      this.viewport,
      this.uiManager
    );
    this.levelGenerator = new LevelGenerator(p, this.gameState);
    this.movementManager = new MovementManager(
      p,
      this.gameState,
      this.audioManager,
      this.viewport,
      this.levelGenerator
    );
    this.collisionManager = new CollisionManager(
      p,
      this.gameState,
      this.audioManager
    );
    this.inputManager = new InputManager(
      p,
      this.gameState,
      this.levelGenerator,
      this.audioManager,
      this.uiManager
    );
    this.gameLogic = new GameLogicManager(
      p,
      this.gameState,
      this.renderer,
      this.audioManager,
      this.levelGenerator,
      this.movementManager,
      this.collisionManager,
      this.inputManager
    );
  }

  public async setup(): Promise<void> {
    // Create responsive full-window canvas
    const canvas = this.p.createCanvas(window.innerWidth, window.innerHeight);
    canvas.parent("app");

    // Setup window resize handler
    window.addEventListener("resize", () => {
      this.viewport.updateViewport();
    });

    // Setup game logic
    await this.gameLogic.setupGame();

    // Setup UI for production mode
    this.uiManager.createProductionUI(async (playerName: string) => {
      await this.gameLogic.startGame(playerName);
      this.uiManager.removeUI();
    });

    // Setup text alignment and font
    this.p.textAlign(this.p.CENTER);
    if (this.font) {
      this.p.textFont(this.font);
    }
  }

  public preload(): void {
    // Load the Monaco font from the public folder
    this.font = this.p.loadFont("/PressStart2P-vaV7.ttf");

    // Load the castle sprite - try PNG first as SVG can be problematic
    this.p.loadImage(
      "/sprites/castle.png",
      (img) => {
        // Success callback - PNG image loaded successfully
        console.log("✅ Castle PNG image loaded successfully:", img);
        this.renderer.setCastleImage(img);
      },
      (err) => {
        console.warn("⚠️ PNG failed, trying SVG:", err);
        // Fallback to SVG if PNG doesn't exist
        this.p.loadImage(
          "/sprites/castle.svg",
          (img) => {
            // Success callback - SVG image loaded successfully
            console.log("✅ Castle SVG image loaded successfully:", img);
            this.renderer.setCastleImage(img);
          },
          (err) => {
            // Error callback - both formats failed to load
            console.error(
              "❌ Failed to load castle image (both PNG and SVG):",
              err
            );
            this.renderer.setCastleImage(null);
          }
        );
      }
    );
  }

  public draw(): void {
    this.gameLogic.update();

    // Draw letterbox/pillarbox background first
    this.viewport.drawLetterbox();

    // Draw game area background
    this.viewport.drawGameBackground();

    // Apply viewport transformation and render game
    this.gameLogic.render();
  }

  public getGameState(): GameStateManager {
    return this.gameState;
  }

  public getAudioManager(): AudioManager {
    return this.audioManager;
  }

  public getRenderer(): Renderer {
    return this.renderer;
  }

  public getUIManager(): UIManager {
    return this.uiManager;
  }
}
