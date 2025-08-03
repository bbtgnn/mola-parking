import type { LevelDifficulty, DifficultyConfig } from "./types.js";
import { config } from "./config.js";

/**
 * DifficultyManager handles progressive difficulty calculation for each level.
 * Combines base values, auto-scaling formulas, and manual overrides for fine-tuning.
 */
export class DifficultyManager {
  private difficultyConfig: DifficultyConfig;

  constructor() {
    this.difficultyConfig = config.difficulty;
  }

  /**
   * Calculate complete difficulty parameters for a specific level
   * @param level - The level number (1-based)
   * @returns LevelDifficulty object with all calculated parameters
   */
  public calculateDifficulty(level: number): LevelDifficulty {
    const { base, scaling, overrides } = this.difficultyConfig;

    // Start with base values
    let difficulty: LevelDifficulty = {
      obstacles: base.obstacles,
      enemies: base.enemies,
      safeAreaPadding: base.safeAreaPadding,
      enemySpeed: base.enemySpeed,
      enemyDirectionRandom: base.enemyDirectionRandom,
    };

    // Apply auto-scaling based on level
    if (level > 1) {
      const levelModifier = level - 1; // 0-based for scaling calculations

      difficulty.obstacles = Math.round(
        base.obstacles + scaling.obstacleGrowth * levelModifier
      );
      difficulty.enemies = Math.round(
        base.enemies + scaling.enemyGrowth * levelModifier
      );
      difficulty.safeAreaPadding = Math.max(
        5,
        base.safeAreaPadding - scaling.paddingReduction * levelModifier
      ); // Minimum 5px
      difficulty.enemySpeed =
        base.enemySpeed + scaling.speedIncrease * levelModifier;
      difficulty.enemyDirectionRandom = level >= scaling.randomDirectionLevel;
    }

    // Apply manual overrides for specific levels
    if (overrides[level]) {
      const override = overrides[level];
      if (override.obstacles !== undefined)
        difficulty.obstacles = override.obstacles;
      if (override.enemies !== undefined) difficulty.enemies = override.enemies;
      if (override.safeAreaPadding !== undefined)
        difficulty.safeAreaPadding = override.safeAreaPadding;
      if (override.enemySpeed !== undefined)
        difficulty.enemySpeed = override.enemySpeed;
      if (override.enemyDirectionRandom !== undefined)
        difficulty.enemyDirectionRandom = override.enemyDirectionRandom;
    }

    // Debug output for development
    if (config.development) {
      console.log(`🎯 Level ${level} Difficulty:`, {
        obstacles: difficulty.obstacles,
        enemies: difficulty.enemies,
        safeAreaPadding: difficulty.safeAreaPadding,
        enemySpeed: difficulty.enemySpeed.toFixed(1),
        randomDirection: difficulty.enemyDirectionRandom,
      });
    }

    return difficulty;
  }

  /**
   * Get the number of obstacles for a specific level
   */
  public getObstacleCount(level: number): number {
    return this.calculateDifficulty(level).obstacles;
  }

  /**
   * Get the number of enemies for a specific level
   */
  public getEnemyCount(level: number): number {
    return this.calculateDifficulty(level).enemies;
  }

  /**
   * Get the safe area padding for a specific level
   */
  public getSafeAreaPadding(level: number): number {
    return this.calculateDifficulty(level).safeAreaPadding;
  }

  /**
   * Get the enemy speed multiplier for a specific level
   */
  public getEnemySpeed(level: number): number {
    return this.calculateDifficulty(level).enemySpeed;
  }

  /**
   * Check if enemy direction should be randomized for a specific level
   */
  public shouldRandomizeEnemyDirection(level: number): boolean {
    return this.calculateDifficulty(level).enemyDirectionRandom;
  }

  /**
   * Get a formatted difficulty summary for debugging/display
   */
  public getDifficultySummary(level: number): string {
    const difficulty = this.calculateDifficulty(level);
    return (
      `Level ${level}: ${difficulty.obstacles} obstacles, ${difficulty.enemies} enemies, ` +
      `${difficulty.safeAreaPadding}px padding, ${difficulty.enemySpeed.toFixed(
        1
      )}x speed, ` +
      `random dir: ${difficulty.enemyDirectionRandom}`
    );
  }

  /**
   * Preview difficulty progression for all levels (useful for balancing)
   */
  public previewDifficultyProgression(maxLevels: number): string[] {
    const summaries: string[] = [];
    for (let level = 1; level <= maxLevels; level++) {
      summaries.push(this.getDifficultySummary(level));
    }
    return summaries;
  }
}
