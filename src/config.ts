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
  development: import.meta.env.DEV,
  skip_home_if_dev: false,
  debug_mode: import.meta.env.DEV,
  disable_audio_in_dev: true, // Set to false to enable audio in development
  show_dev_ui: import.meta.env.DEV,
  auto_start_level: import.meta.env.DEV ? 1 : undefined,
  // Color configuration
  game_background_color: [0, 0, 0], // Dark red for game area
  letterbox_color: [0, 0, 255], // Blue for letterbox/pillarbox areas
  // Layout configuration
  min_margin_pixels: 20, // Minimum margin around game area in pixels
};
