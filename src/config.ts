export interface GameConfig {
  development: boolean;
  skip_home_if_dev: boolean;
  debug_mode: boolean;
  disable_audio_in_dev: boolean;
  show_dev_ui: boolean;
  auto_start_level?: number;
}

export const config: GameConfig = {
  development: import.meta.env.DEV,
  skip_home_if_dev: true,
  debug_mode: import.meta.env.DEV,
  disable_audio_in_dev: true, // Set to false to enable audio in development
  show_dev_ui: import.meta.env.DEV,
  auto_start_level: import.meta.env.DEV ? 1 : undefined,
};
