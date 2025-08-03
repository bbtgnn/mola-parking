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
      obstacles: 2, // Starting number of obstacles
      enemies: 1, // Starting number of enemies
      safeAreaPadding: 25, // Starting safe area padding (pixels)
      enemySpeed: 0.8, // Starting enemy speed multiplier
      enemyDirectionRandom: false, // Don't randomize direction at start
    },
    // Auto-scaling formulas per level
    scaling: {
      obstacleGrowth: 3, // +0.5 obstacles per level
      enemyGrowth: 0.3, // +0.3 enemies per level
      paddingReduction: 2, // -2px safe area per level (minimum 5px)
      speedIncrease: 0.1, // +0.1 speed multiplier per level
      randomDirectionLevel: 3, // Startas randomizing direction from level 3
    },
    // Manual overrides for specific levels (for fine-tuning)
    overrides: {
      5: { obstacles: 6, enemies: 3 }, // Level 5: exactly 6 obstacles, 3 enemies
      8: { safeAreaPadding: 8, enemySpeed: 2.2 }, // Level 8: very tight safe areas, fast enemies
      10: { obstacles: 10, enemies: 5, safeAreaPadding: 5, enemySpeed: 2.5 }, // Final boss level
    },
  },
  // Color configuration
  game_background_color: [0, 0, 0], // Black game area background
  letterbox_color: [0, 0, 255], // Blue letterbox/pillarbox areas
  // Layout configuration
  min_margin_pixels: 20, // Minimum margin around game area in pixels
};
