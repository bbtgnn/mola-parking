export interface GameConfig {
  development: boolean;
  skip_home_if_dev: boolean;
  debug_mode: boolean;
  disable_audio_in_dev: boolean;
  show_dev_ui: boolean;
  auto_start_level?: number;
  // Color configuration
  game_background_color: [number, number, number]; // RGB values for game area background
  letterbox_color: [number, number, number]; // RGB values for letterbox/pillarbox areas
  // Layout configuration
  min_margin_pixels: number; // Minimum margin around game area in pixels
}

export const config: GameConfig = {
  development: false, // PRODUCTION: Always false for production build
  skip_home_if_dev: false, // PRODUCTION: Always show intro screen
  debug_mode: false, // PRODUCTION: Disable debug mode
  disable_audio_in_dev: false, // PRODUCTION: Enable audio
  show_dev_ui: false, // PRODUCTION: Hide development UI
  auto_start_level: undefined, // PRODUCTION: No auto-start, normal game flow
  // Color configuration
  game_background_color: [0, 0, 0], // Black game area background
  letterbox_color: [0, 0, 255], // Blue letterbox/pillarbox areas
  // Layout configuration
  min_margin_pixels: 20, // Minimum margin around game area in pixels
};
