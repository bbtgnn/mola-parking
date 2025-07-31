import type {
  Car,
  ParkingSpot,
  Obstacle,
  Boat,
  Enemy,
  FakeParkingSpot,
  GameState,
} from "./types";

export class GameStateManager {
  // Game objects
  public car: Car | null = null;
  public parkingSpot: ParkingSpot | null = null;
  public obstacles: Obstacle[] = [];
  public boats: Boat[] = [];
  public enemies: Enemy[] = [];
  public fakeParkingSpots: FakeParkingSpot[] = [];

  // Game state
  public level: number = 1;
  public gameOver: boolean = false;
  public win: boolean = false;
  public gameState: GameState = "menu";
  public playerName: string = "";

  // Reset game state for new level
  public resetLevel(): void {
    this.obstacles = [];
    this.boats = [];
    this.fakeParkingSpots = [];
    this.enemies = [];
    this.gameOver = false;
    this.win = false;
  }

  // Reset entire game
  public resetGame(): void {
    this.level = 1;
    this.playerName = "";
    this.gameState = "menu";
    this.resetLevel();
  }

  // Start new level
  public startLevel(level: number): void {
    this.level = level;
    this.resetLevel();
  }

  // Advance to next level
  public nextLevel(): void {
    this.level++;
    this.resetLevel();
  }

  // Set game state
  public setGameState(state: GameState): void {
    this.gameState = state;
  }

  // Set player name
  public setPlayerName(name: string): void {
    this.playerName = name;
  }

  // Check if game is complete (all 10 levels)
  public isGameComplete(): boolean {
    return this.level > 10;
  }

  // Check if currently in menu
  public isInMenu(): boolean {
    return this.gameState === "menu";
  }

  // Check if currently playing
  public isPlaying(): boolean {
    return this.gameState === "playing";
  }
}
