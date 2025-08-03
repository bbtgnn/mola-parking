import p5 from "p5";

// Game object interfaces
export interface Car {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  angle: number;
}

export interface ParkingSpot {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Obstacle {
  x: number;
  y: number;
  w: number;
  h: number;
  col: p5.Color;
  type: "palm" | "lamp" | "car";
}

export interface Boat {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  col: p5.Color;
  wave: number;
}

export interface Enemy {
  x: number;
  y: number;
  w: number;
  h: number;
  speed: number;
  col: p5.Color;
}

export interface FakeParkingSpot {
  x: number;
  y: number;
  w: number;
  h: number;
  angle: number;
}

// Game state types
export type GameState = "menu" | "playing";

// Difficulty configuration types
export interface DifficultyBase {
  obstacles: number;
  enemies: number;
  safeAreaPadding: number;
  enemySpeed: number;
  enemyDirectionRandom: boolean;
}

export interface DifficultyScaling {
  obstacleGrowth: number; // Obstacles added per level
  enemyGrowth: number; // Enemies added per level
  paddingReduction: number; // Safe area reduction per level
  speedIncrease: number; // Enemy speed increase per level
  randomDirectionLevel: number; // Level where direction randomization starts
}

export interface DifficultyOverride {
  obstacles?: number;
  enemies?: number;
  safeAreaPadding?: number;
  enemySpeed?: number;
  enemyDirectionRandom?: boolean;
}

export interface DifficultyConfig {
  base: DifficultyBase;
  scaling: DifficultyScaling;
  overrides: Record<number, DifficultyOverride>; // Level number -> overrides
}

export interface LevelDifficulty {
  obstacles: number;
  enemies: number;
  safeAreaPadding: number;
  enemySpeed: number;
  enemyDirectionRandom: boolean;
}

// Audio types
export interface AudioNodes {
  audioContext: AudioContext;
  motorGain: GainNode;
  hornGain: GainNode;
  winGain: GainNode;
  enemyGain: GainNode;
  musicGain: GainNode;
  motorOsc: OscillatorNode;
  hornOsc: OscillatorNode;
  winOsc: OscillatorNode;
  enemyOsc: OscillatorNode;
  musicOsc: OscillatorNode;
  bassOsc: OscillatorNode;
}
