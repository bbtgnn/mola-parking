import type { DifficultyConfig } from "./types.js";

export interface GameConfig {
  development: boolean;
  skip_home_if_dev: boolean;
  debug_mode: boolean;
  disable_audio_in_dev: boolean;
  show_dev_ui: boolean;
  auto_start_level?: number;
  // Game configuration
  max_levels: number; // Maximum number of levels in the game
  difficulty: DifficultyConfig; // Progressive difficulty configuration
  // Color configuration
  game_background_color: [number, number, number]; // RGB values for game area background
  letterbox_color: [number, number, number]; // RGB values for letterbox/pillarbox areas
  // Layout configuration
  min_margin_pixels: number; // Minimum margin around game area in pixels
}

export const config: GameConfig = {
  development: true, // PRODUCTION: Always false for production build
  skip_home_if_dev: false, // PRODUCTION: Always show intro screen
  debug_mode: false, // PRODUCTION: Disable debug mode
  disable_audio_in_dev: false, // PRODUCTION: Enable audio
  show_dev_ui: false, // PRODUCTION: Hide development UI
  auto_start_level: undefined, // PRODUCTION: No auto-start, normal game flow
  // Game configuration
  max_levels: 10, // PRODUCTION: Configure total number of levels
  // Progressive difficulty configuration
  difficulty: {
    // Base values for level 1
    base: {
      obstacles: 3, // Starting number of obstacles (harder from start)
      enemies: 1, // Starting number of enemies
      safeAreaPadding: 22, // Starting safe area padding (tighter from start)
      enemySpeed: 0.9, // Starting enemy speed multiplier (faster from start)
      enemyDirectionRandom: false, // Don't randomize direction at start
    },
    // Auto-scaling formulas per level
    scaling: {
      obstacleGrowth: 1.2, // +1.2 obstacles per level (aggressive)
      enemyGrowth: 0.5, // +0.5 enemies per level (more enemies faster)
      paddingReduction: 3, // -3px safe area per level (tighter faster)
      speedIncrease: 0.15, // +0.15 speed multiplier per level (faster acceleration)
      randomDirectionLevel: 2, // Start randomizing direction from level 2 (earlier chaos)
    },
    // Manual overrides for specific levels (for fine-tuning)
    overrides: {
      5: { obstacles: 8, enemies: 4, safeAreaPadding: 12 }, // Level 5: mid-game spike
      7: { obstacles: 12, enemies: 5, enemySpeed: 1.8 }, // Level 7: pre-boss difficulty spike
      8: { safeAreaPadding: 6, enemySpeed: 2.4 }, // Level 8: very tight areas, fast enemies
      10: { obstacles: 18, enemies: 8, safeAreaPadding: 3, enemySpeed: 3.0 }, // Final boss: INSANE
    },
  },
  // Color configuration
  game_background_color: [0, 0, 0], // Black game area background
  letterbox_color: [0, 0, 255], // Blue letterbox/pillarbox areas
  // Layout configuration
  min_margin_pixels: 20, // Minimum margin around game area in pixels
};
