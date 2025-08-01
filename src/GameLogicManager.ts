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
    // Setup input handlers
    this.inputManager.setupKeyHandlers();

    // Development mode: skip setup screen
    if (config.development && config.skip_home_if_dev) {
      await this.startGameInDevMode();
    } else {
      // Ensure game state is set to menu for production mode
      this.gameState.setGameState("menu");
    }

    this.setupComplete = true;
  }

  private async startGameInDevMode(): Promise<void> {
    // Auto-start with default player name
    this.gameState.setPlayerName("Developer");
    this.gameState.setGameState("playing");

    // Initialize audio (conditionally in dev mode)
    if (!config.disable_audio_in_dev) {
      await this.audioManager.initializeAudio();
      this.audioManager.playMusic();
    }

    // Start the specified level or level 1
    const startLevel = config.auto_start_level || 1;
    this.gameState.level = startLevel;
    this.levelGenerator.resetCar();
    this.levelGenerator.generateLevel(startLevel);
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

    // Apply viewport transformation for all game elements
    this.renderer.applyGameTransform();

    // Render all game elements (now in logical coordinates)
    this.renderer.drawCastle();
    this.renderer.drawFakeParkingSpots();
    this.renderer.drawParkingSpot();
    this.renderer.drawObstacles();
    this.renderer.drawEnemies();
    this.renderer.drawBoats();
    this.renderer.drawCar();
    this.renderer.drawUI();
    this.renderer.drawMessages();

    // Reset transformation
    this.renderer.resetTransform();

    // Render dev UI in actual screen coordinates (outside game world)
    this.renderer.drawDevUI();
  }

  public isInMenu(): boolean {
    return this.gameState.isInMenu();
  }
}
