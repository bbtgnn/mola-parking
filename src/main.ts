import "./style.css";
import p5 from "p5";
import { GameStateManager } from "./GameState";
import { Renderer } from "./Renderer";
import { AudioManager } from "./AudioManager";
import { LevelGenerator } from "./LevelGenerator";
import { MovementManager } from "./MovementManager";
import { CollisionManager } from "./CollisionManager";
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

    // Initialize renderer, level generator, movement manager, and collision manager
    renderer = new Renderer(p, gameState);
    levelGenerator = new LevelGenerator(p, gameState);
    movementManager = new MovementManager(p, gameState, audioManager);
    collisionManager = new CollisionManager(p, gameState, audioManager);

    // Development mode: skip setup screen
    if (config.development && config.skip_home_if_dev) {
      // Auto-start with default player name
      gameState.setPlayerName("Developer");
      gameState.setGameState("playing");

      // Initialize audio
      audioManager.initializeAudio();
      audioManager.playMusic();

      // Start the specified level or level 1
      const startLevel = config.auto_start_level || 1;
      gameState.level = startLevel;
      levelGenerator.resetCar();
      levelGenerator.generateLevel(startLevel);

      console.log(
        "🚀 Development mode: Skipped setup screen, starting level",
        startLevel
      );
    } else {
      // Normal setup for production
      nameInput = p.createInput("");
      nameInput.position(p.width / 2 - 100, p.height / 2 + 50);
      nameInput.size(200);
      nameInput.attribute("placeholder", "Nome Pilota");
      styleInput(nameInput);

      playButton = p.createButton("START");
      playButton.position(p.width / 2 - 60, p.height / 2 + 100);
      styleButton(playButton);
      playButton.mousePressed(startGame);
    }

    p.textAlign(p.CENTER);
    // Use the loaded Monaco font
    p.textFont(monacoFont);
  };

  function startGame() {
    if ((nameInput as any).value() === "") {
      alert("Inserisci il tuo nome!");
      return;
    }

    gameState.setPlayerName((nameInput as any).value());
    gameState.setGameState("playing");
    nameInput.remove();
    playButton.remove();

    // Initialize audio
    audioManager.initializeAudio();
    audioManager.playMusic();

    startLevel(gameState.level);
  }

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

  function startLevel(lvl: number) {
    levelGenerator.resetCar();
    levelGenerator.generateLevel(lvl);
  }

  p.draw = () => {
    p.background(0);

    if (gameState.isInMenu()) {
      renderer.drawMenu();
      return;
    }

    renderer.drawCastle();
    renderer.drawFakeParkingSpots();
    renderer.drawParkingSpot();
    renderer.drawObstacles();
    renderer.drawEnemies();
    renderer.drawBoats();
    renderer.drawCar();

    if (collisionManager.isGameActive()) {
      movementManager.updateAllMovement();
      collisionManager.checkAllCollisions();
      collisionManager.checkParking();
    }

    renderer.drawUI();
    renderer.drawMessages();
  };

  p.keyPressed = () => {
    if ((p.key === "r" || p.key === "R") && gameState.gameOver) {
      startLevel(gameState.level);
    }
    if (
      (p.key === "n" || p.key === "N") &&
      gameState.win &&
      gameState.level < 11
    ) {
      gameState.nextLevel();
      startLevel(gameState.level);
    }
  };
};

// Initialize p5.js
new p5(sketch);
