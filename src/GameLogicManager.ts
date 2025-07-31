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

  public setupGame(): void {
    // Setup input handlers
    this.inputManager.setupKeyHandlers();

    // Development mode: skip setup screen
    if (config.development && config.skip_home_if_dev) {
      this.startGameInDevMode();
    }
  }

  private startGameInDevMode(): void {
    // Auto-start with default player name
    this.gameState.setPlayerName("Developer");
    this.gameState.setGameState("playing");

    // Initialize audio
    this.audioManager.initializeAudio();
    this.audioManager.playMusic();

    // Start the specified level or level 1
    const startLevel = config.auto_start_level || 1;
    this.gameState.level = startLevel;
    this.levelGenerator.resetCar();
    this.levelGenerator.generateLevel(startLevel);

    console.log(
      "🚀 Development mode: Skipped setup screen, starting level",
      startLevel
    );
  }

  public startGame(playerName: string): void {
    if (playerName === "") {
      alert("Inserisci il tuo nome!");
      return;
    }

    this.gameState.setPlayerName(playerName);
    this.gameState.setGameState("playing");

    // Initialize audio
    this.audioManager.initializeAudio();
    this.audioManager.playMusic();

    this.startLevel(this.gameState.level);
  }

  public startLevel(level: number): void {
    this.levelGenerator.resetCar();
    this.levelGenerator.generateLevel(level);
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
