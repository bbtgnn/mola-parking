import "./style.css";
import p5 from "p5";
import { GameStateManager } from "./GameState";
import { Renderer } from "./Renderer";
import { AudioManager } from "./AudioManager";
import { LevelGenerator } from "./LevelGenerator";
import { MovementManager } from "./MovementManager";
import { CollisionManager } from "./CollisionManager";
import { InputManager } from "./InputManager";
import { GameLogicManager } from "./GameLogicManager";
import { config } from "./config";

// Game state manager
const gameState = new GameStateManager();

// Audio manager
const audioManager = new AudioManager();

// Level generator
let levelGenerator: LevelGenerator;

// Movement manager
let movementManager: MovementManager;

// Collision manager
let collisionManager: CollisionManager;

// Input manager
let inputManager: InputManager;

// Game logic manager
let gameLogic: GameLogicManager;

// UI elements
let nameInput: p5.Element, playButton: p5.Element;
let monacoFont: p5.Font;
let renderer: Renderer;

const sketch = (p: p5) => {
  p.preload = () => {
    // Load the Monaco font from the public folder
    monacoFont = p.loadFont("/Monaco.ttf");
  };

  p.setup = () => {
    const canvas = p.createCanvas(1000, 700);
    canvas.parent("app");

    // Initialize all managers
    renderer = new Renderer(p, gameState);
    levelGenerator = new LevelGenerator(p, gameState);
    movementManager = new MovementManager(p, gameState, audioManager);
    collisionManager = new CollisionManager(p, gameState, audioManager);
    inputManager = new InputManager(p, gameState, levelGenerator);
    gameLogic = new GameLogicManager(
      p,
      gameState,
      renderer,
      audioManager,
      levelGenerator,
      movementManager,
      collisionManager,
      inputManager
    );

    // Setup game logic
    gameLogic.setupGame();

    // Setup UI for production mode
    if (!config.development || !config.skip_home_if_dev) {
      nameInput = p.createInput("");
      nameInput.position(p.width / 2 - 100, p.height / 2 + 50);
      nameInput.size(200);
      nameInput.attribute("placeholder", "Nome Pilota");
      styleInput(nameInput);

      playButton = p.createButton("START");
      playButton.position(p.width / 2 - 60, p.height / 2 + 100);
      styleButton(playButton);
      playButton.mousePressed(() =>
        gameLogic.startGame((nameInput as any).value())
      );
    }

    p.textAlign(p.CENTER);
    // Use the loaded Monaco font
    p.textFont(monacoFont);
  };

  function styleInput(el: p5.Element) {
    el.style("background", "#111");
    el.style("border", "2px solid #00FF00");
    el.style("color", "#00FF00");
    el.style("padding", "8px");
    el.style("font-family", "Monaco, monospace");
  }

  function styleButton(el: p5.Element) {
    el.style("background", "#000");
    el.style("border", "2px solid #00FF00");
    el.style("color", "#00FF00");
    el.style("padding", "10px 20px");
    el.style("font-family", "Monaco, monospace");
    el.style("font-size", "16px");
    el.style("cursor", "pointer");
  }

  p.draw = () => {
    gameLogic.update();
    gameLogic.render();
  };
};

// Initialize p5.js
new p5(sketch);
