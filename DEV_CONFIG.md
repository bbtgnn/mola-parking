# 🛠️ Development Configuration

This document outlines the development flags and configurations available in MOLA Parking.

## Configuration File: `src/config.ts`

### Available Flags

| Flag                   | Type      | Default               | Description                                           |
| ---------------------- | --------- | --------------------- | ----------------------------------------------------- |
| `development`          | `boolean` | `import.meta.env.DEV` | Automatic detection of development mode               |
| `skip_home_if_dev`     | `boolean` | `true`                | Skip the home/setup screen in development mode        |
| `debug_mode`           | `boolean` | `import.meta.env.DEV` | Enable debug features (currently for console logging) |
| `disable_audio_in_dev` | `boolean` | `true`                | **NEW**: Disable all audio in development mode        |
| `show_dev_ui`          | `boolean` | `import.meta.env.DEV` | **NEW**: Show development UI overlay                  |
| `auto_start_level`     | `number?` | `1` (dev only)        | Auto-start at specific level in development mode      |

### 🎵 Audio Development Toggle

The `disable_audio_in_dev` flag allows you to completely disable audio during development:

- **When `true`** (default): Audio is disabled for faster, quieter development
- **When `false`**: Audio works normally in development
  - Faster startup (no Web Audio API initialization)
  - No browser autoplay policy issues
  - Prevents audio context warnings in console
  - Useful for UI/logic development without audio distractions

### 🔍 Development UI

The `show_dev_ui` flag displays a real-time development panel showing:

- **Game State**: Current state (menu/playing)
- **Level**: Current level number
- **Player**: Player name
- **Object Counts**:
  - Obstacles count
  - Enemies count
  - Boats count
  - Fake parking spots count
- **Audio Status**: Shows if audio is enabled/disabled
- **Car Position**: Real-time car coordinates (or "NOT INITIALIZED")

### 🚀 Quick Setup for Different Development Scenarios

#### Silent Development (No Audio) - **DEFAULT**

```typescript
export const config: GameConfig = {
  // ... other settings
  disable_audio_in_dev: true, // DEFAULT
  show_dev_ui: true,
};
```

#### Audio Testing

```typescript
export const config: GameConfig = {
  // ... other settings
  disable_audio_in_dev: false, // Enable for audio testing
  show_dev_ui: true,
};
```

#### Production-like Testing

```typescript
export const config: GameConfig = {
  // ... other settings
  skip_home_if_dev: false,
  show_dev_ui: false,
  disable_audio_in_dev: false,
};
```

### 🐛 Debug Console Messages

When in development mode, you'll see these console messages:

- `🔧 Starting game setup...`
- `🔧 Input handlers setup complete`
- `🔧 Development mode detected, starting dev mode...`
- `🚀 Starting dev mode initialization...`
- `🚀 Game state set to playing`
- `🚀 Initializing audio...` (or `🔇 Audio initialization skipped`)
- `🚀 Audio initialized` / `🚀 Music started`
- `🚀 Level generated: X`
- `🔧 Dev mode setup complete`
- `🔧 Setup complete flag set to true`

### ⌨️ **Runtime Keyboard Shortcuts** (Development Mode Only)

| Key   | Action        | Description                             |
| ----- | ------------- | --------------------------------------- |
| **D** | Toggle Dev UI | Show/hide the development overlay panel |
| **A** | Toggle Audio  | Enable/disable audio on the fly         |
| **R** | Restart Level | Restart current level (when game over)  |
| **N** | Next Level    | Advance to next level (when won)        |

The keyboard shortcuts are only active in development mode and provide instant toggling without needing to restart the application.

### 💡 Tips

1. **Audio Issues**: If you're experiencing loading problems, try setting `disable_audio_in_dev: true` or press **A** to toggle audio
2. **UI Development**: Use `show_dev_ui: true` to monitor game state in real-time, or press **D** to toggle
3. **Quick Testing**: Use `auto_start_level` to jump to specific levels
4. **Performance**: Disabling audio can speed up development iterations
5. **Runtime Control**: Use the keyboard shortcuts for instant feedback during development
