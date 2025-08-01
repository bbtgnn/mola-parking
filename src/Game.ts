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
  private monacoFont: p5.Font | null = null;

  constructor(p: p5) {
    this.p = p;

    // Initialize viewport manager first
    this.viewport = new ViewportManager(p);

    // Initialize all managers
    this.gameState = new GameStateManager();
    this.audioManager = new AudioManager();
    this.renderer = new Renderer(p, this.gameState, this.viewport);
    this.levelGenerator = new LevelGenerator(p, this.gameState);
    this.movementManager = new MovementManager(
      p,
      this.gameState,
      this.audioManager,
      this.viewport
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
      this.audioManager
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
    this.uiManager = new UIManager(p, this.viewport);
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
    if (this.monacoFont) {
      this.p.textFont(this.monacoFont);
    }
  }

  public preload(): void {
    // Load the Monaco font from the public folder
    this.monacoFont = this.p.loadFont("/Monaco.ttf");
  }

  public draw(): void {
    this.gameLogic.update();

    // Draw letterbox/pillarbox background first
    this.viewport.drawLetterbox();

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
}
