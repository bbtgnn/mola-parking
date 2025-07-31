import "./style.css";
import p5 from "p5";
import { Game } from "./Game";

// Main game instance
let game: Game;

const sketch = (p: p5) => {
  p.preload = () => {
    // Game will handle preload internally
  };

  p.setup = () => {
    // Initialize the main game
    game = new Game(p);
    game.preload();
    game.setup();
  };

  p.draw = () => {
    // Game will handle all drawing internally
    game.draw();
  };
};

// Initialize p5.js
new p5(sketch);
