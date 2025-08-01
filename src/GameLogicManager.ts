import type p5 from "p5";
import { GameStateManager } from "./GameState";
import { Renderer } from "./Renderer";
import { AudioManager } from "./AudioManager";
import { LevelGenerator } from "./LevelGenerator";
import { MovementManager } from "./MovementManager";
import { CollisionManager } from "./CollisionManager";
import { InputManager } from "./InputManager";
import { config } from "./config";

export class GameLogicManager {
  private p: p5;
  private gameState: GameStateManager;
  private renderer: Renderer;
  private audioManager: AudioManager;
  private levelGenerator: LevelGenerator;
  private movementManager: MovementManager;
  private collisionManager: CollisionManager;
  private inputManager: InputManager;
  private setupComplete: boolean = false;

  constructor(
    p: p5,
    gameState: GameStateManager,
    renderer: Renderer,
    audioManager: AudioManager,
    levelGenerator: LevelGenerator,
    movementManager: MovementManager,
    collisionManager: CollisionManager,
    inputManager: InputManager
  ) {
    this.p = p;
    this.gameState = gameState;
    this.renderer = renderer;
    this.audioManager = audioManager;
    this.levelGenerator = levelGenerator;
    this.movementManager = movementManager;
    this.collisionManager = collisionManager;
    this.inputManager = inputManager;
  }

  public async setupGame(): Promise<void> {
    console.log("🔧 Starting game setup...");

    // Setup input handlers
    this.inputManager.setupKeyHandlers();
    console.log("🔧 Input handlers setup complete");

    // Development mode: skip setup screen
    if (config.development && config.skip_home_if_dev) {
      console.log("🔧 Development mode detected, starting dev mode...");
      await this.startGameInDevMode();
      console.log("🔧 Dev mode setup complete");
    } else {
      // Ensure game state is set to menu for production mode
      this.gameState.setGameState("menu");
      console.log("🔧 Production mode, set to menu");
    }

    this.setupComplete = true;
    console.log("🔧 Setup complete flag set to true");
  }

  private async startGameInDevMode(): Promise<void> {
    console.log("🚀 Starting dev mode initialization...");

    // Auto-start with default player name
    this.gameState.setPlayerName("Developer");
    this.gameState.setGameState("playing");
    console.log("🚀 Game state set to playing");

    // Initialize audio
    console.log("🚀 Initializing audio...");
    await this.audioManager.initializeAudio();
    console.log("🚀 Audio initialized");
    this.audioManager.playMusic();
    console.log("🚀 Music started");

    // Start the specified level or level 1
    const startLevel = config.auto_start_level || 1;
    this.gameState.level = startLevel;
    this.levelGenerator.resetCar();
    this.levelGenerator.generateLevel(startLevel);
    console.log("🚀 Level generated:", startLevel);
  }

  public async startGame(playerName: string): Promise<void> {
    if (playerName === "") {
      alert("Inserisci il tuo nome!");
      return;
    }

    this.gameState.setPlayerName(playerName);
    this.gameState.setGameState("playing");

    // Initialize audio
    await this.audioManager.initializeAudio();
    this.audioManager.playMusic();

    this.startLevel(this.gameState.level);
  }

  public startLevel(level: number): void {
    this.levelGenerator.resetCar();
    this.levelGenerator.generateLevel(level);

    // Update audio BPM for the new level
    this.audioManager.setLevel(level);
  }

  public update(): void {
    // Update game logic only if game is active
    if (this.collisionManager.isGameActive()) {
      this.movementManager.updateAllMovement();
      this.collisionManager.checkAllCollisions();
      this.collisionManager.checkParking();
    }
  }

  public render(): void {
    this.p.background(0);

    // Don't render until setup is complete
    if (!this.setupComplete) {
      this.p.fill(255);
      this.p.textAlign(this.p.CENTER, this.p.CENTER);
      this.p.textSize(24);
      this.p.text("Loading...", this.p.width / 2, this.p.height / 2);
      return;
    }

    if (this.gameState.isInMenu()) {
      this.renderer.drawMenu();
      return;
    }

    // Render all game elements
    this.renderer.drawCastle();
    this.renderer.drawFakeParkingSpots();
    this.renderer.drawParkingSpot();
    this.renderer.drawObstacles();
    this.renderer.drawEnemies();
    this.renderer.drawBoats();
    this.renderer.drawCar();

    // Render UI elements
    this.renderer.drawUI();
    this.renderer.drawMessages();
  }

  public isInMenu(): boolean {
    return this.gameState.isInMenu();
  }
}
