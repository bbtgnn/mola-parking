import "./style.css";
import p5 from "p5";
import type { Car, ParkingSpot, Obstacle, Boat, Enemy } from "./types";
import { GameStateManager } from "./GameState";
import { Renderer } from "./Renderer";

// Game state manager
const gameState = new GameStateManager();

// Audio variables (will be refactored later)
let audioContext: AudioContext;
let motorGain: GainNode,
  hornGain: GainNode,
  winGain: GainNode,
  enemyGain: GainNode,
  musicGain: GainNode;
let motorOsc: OscillatorNode,
  hornOsc: OscillatorNode,
  winOsc: OscillatorNode,
  enemyOsc: OscillatorNode,
  musicOsc: OscillatorNode,
  bassOsc: OscillatorNode;

// UI elements
let nameInput: p5.Element, playButton: p5.Element;
let audioStarted = false;
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

    // Initialize renderer
    renderer = new Renderer(p, gameState);

    nameInput = p.createInput("");
    nameInput.position(p.width / 2 - 100, p.height / 2 + 50);
    nameInput.size(200);
    nameInput.attribute("placeholder", "Nome Pilota");
    styleInput(nameInput);

    playButton = p.createButton("START");
    playButton.position(p.width / 2 - 60, p.height / 2 + 100);
    styleButton(playButton);
    playButton.mousePressed(startGame);

    p.textAlign(p.CENTER);
    // Use the loaded Monaco font
    p.textFont(monacoFont);
  };

  function startGame() {
    if (!audioStarted) {
      audioStarted = true;
      initAudio();
    }
    gameState.setPlayerName((nameInput as any).value() || "Player");
    nameInput.hide();
    playButton.hide();
    gameState.setGameState("playing");
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

  function initAudio() {
    try {
      audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      motorOsc = audioContext.createOscillator();
      motorGain = audioContext.createGain();
      motorOsc.type = "sine";
      motorOsc.frequency.setValueAtTime(100, audioContext.currentTime);
      motorOsc.connect(motorGain);
      motorGain.connect(audioContext.destination);
      motorGain.gain.setValueAtTime(0, audioContext.currentTime);
      motorOsc.start();

      hornOsc = audioContext.createOscillator();
      hornGain = audioContext.createGain();
      hornOsc.type = "square";
      hornOsc.frequency.setValueAtTime(600, audioContext.currentTime);
      hornOsc.connect(hornGain);
      hornGain.connect(audioContext.destination);
      hornGain.gain.setValueAtTime(0, audioContext.currentTime);
      hornOsc.start();

      winOsc = audioContext.createOscillator();
      winGain = audioContext.createGain();
      winOsc.type = "triangle";
      winOsc.frequency.setValueAtTime(800, audioContext.currentTime);
      winOsc.connect(winGain);
      winGain.connect(audioContext.destination);
      winGain.gain.setValueAtTime(0, audioContext.currentTime);
      winOsc.start();

      enemyOsc = audioContext.createOscillator();
      enemyGain = audioContext.createGain();
      enemyOsc.type = "sawtooth";
      enemyOsc.frequency.setValueAtTime(300, audioContext.currentTime);
      enemyOsc.connect(enemyGain);
      enemyGain.connect(audioContext.destination);
      enemyGain.gain.setValueAtTime(0, audioContext.currentTime);
      enemyOsc.start();

      musicOsc = audioContext.createOscillator();
      musicGain = audioContext.createGain();
      musicOsc.type = "square";
      musicOsc.frequency.setValueAtTime(440, audioContext.currentTime);
      musicOsc.connect(musicGain);
      musicGain.connect(audioContext.destination);
      musicGain.gain.setValueAtTime(0.05, audioContext.currentTime);
      musicOsc.start();

      bassOsc = audioContext.createOscillator();
      bassOsc.type = "sine";
      bassOsc.frequency.setValueAtTime(110, audioContext.currentTime);
      bassOsc.connect(musicGain);
      bassOsc.start();

      playBackgroundMusic();
      console.log("Audio inizializzato correttamente");
    } catch (e) {
      console.log("Errore audio:", e);
    }
  }

  function startLevel(lvl: number) {
    gameState.car = { x: 120, y: 550, w: 48, h: 24, speed: 2.5, angle: 0 };
    gameState.parkingSpot = generateParkingSpot(lvl);
    gameState.resetLevel();

    generateFakeParkingSpots(lvl);

    for (let i = 0; i < 8 + lvl; i++) {
      gameState.obstacles.push(generateObstacle(i));
    }

    for (let i = 0; i < 3; i++) {
      gameState.boats.push(generateBoat());
    }

    for (let i = 0; i < 2; i++) {
      gameState.enemies.push({
        x: -150 * (i + 1),
        y: 150 + i * 200,
        w: 48,
        h: 24,
        speed: 1.2 + lvl * 0.1,
        col: p.color(255, 50, 50),
      });
    }
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

    if (!gameState.gameOver && !gameState.win && gameState.level <= 10) {
      moveCar();
      moveEnemies();
      moveBoats();
      checkCollisions();
      checkParking();
    }

    renderer.drawUI();
    renderer.drawMessages();
  };

  function generateParkingSpot(lvl: number): ParkingSpot {
    let spots = [
      { x: 850, y: 150 },
      { x: 850, y: 250 },
      { x: 850, y: 350 },
      { x: 750, y: 120 },
      { x: 750, y: 220 },
      { x: 750, y: 320 },
      { x: 650, y: 150 },
      { x: 650, y: 350 },
      { x: 550, y: 200 },
    ];
    let i = p.min(lvl - 1, spots.length - 1);
    return { x: spots[i].x, y: spots[i].y, w: 60, h: 30 };
  }

  function generateFakeParkingSpots(lvl: number) {
    let spots = [
      { x: 200, y: 200, angle: 0.785 },
      { x: 240, y: 170, angle: 0.785 },
      { x: 280, y: 140, angle: 0.785 },
      { x: 200, y: 300, angle: -0.785 },
      { x: 240, y: 330, angle: -0.785 },
      { x: 280, y: 360, angle: -0.785 },
      { x: 700, y: 200, angle: -0.785 },
      { x: 740, y: 170, angle: -0.785 },
      { x: 780, y: 140, angle: -0.785 },
    ];

    for (let i = 0; i < p.min(lvl + 2, spots.length); i++) {
      gameState.fakeParkingSpots.push({
        x: spots[i].x,
        y: spots[i].y,
        w: 50,
        h: 25,
        angle: spots[i].angle,
      });
    }
  }

  function generateObstacle(index: number): Obstacle {
    let w = p.random(40, 60);
    let h = p.random(20, 35);
    let x = p.random(200, 800);
    let y = p.random(150, 500);
    let colors = [
      p.color(255, 0, 255),
      p.color(0, 255, 255),
      p.color(255, 255, 0),
      p.color(255, 100, 255),
      p.color(100, 255, 255),
    ];

    return {
      x,
      y,
      w,
      h,
      col: p.random(colors),
      type: index % 6 === 0 ? "palm" : index % 4 === 0 ? "lamp" : "car",
    };
  }

  function generateBoat(): Boat {
    return {
      x: p.random(-300, -50),
      y: p.random(50, 150),
      w: 60,
      h: 25,
      speed: p.random(0.8, 2.0),
      col: p.color(0, p.random(150, 255), 255),
      wave: p.random(0, p.TWO_PI),
    };
  }

  function moveCar() {
    if (!gameState.car) return;
    let moving = false;

    if (p.keyIsDown(p.LEFT_ARROW)) {
      gameState.car.angle -= 0.06;
      moving = true;
    }
    if (p.keyIsDown(p.RIGHT_ARROW)) {
      gameState.car.angle += 0.06;
      moving = true;
    }
    if (p.keyIsDown(p.UP_ARROW)) {
      gameState.car.x += p.cos(gameState.car.angle) * gameState.car.speed;
      gameState.car.y += p.sin(gameState.car.angle) * gameState.car.speed;
      moving = true;
    }
    if (p.keyIsDown(p.DOWN_ARROW)) {
      gameState.car.x -= p.cos(gameState.car.angle) * gameState.car.speed * 0.6;
      gameState.car.y -= p.sin(gameState.car.angle) * gameState.car.speed * 0.6;
      moving = true;
    }

    gameState.car.x = p.constrain(
      gameState.car.x,
      gameState.car.w / 2,
      p.width - gameState.car.w / 2
    );
    gameState.car.y = p.constrain(
      gameState.car.y,
      gameState.car.h / 2,
      p.height - 20
    );

    if (audioStarted && motorGain && audioContext) {
      motorGain.gain.setTargetAtTime(
        moving ? 0.1 : 0,
        audioContext.currentTime,
        0.1
      );
    }
  }

  function moveEnemies() {
    for (let e of gameState.enemies) {
      e.x += e.speed;
      if (e.x > p.width + 100) e.x = -150;
    }
  }

  function moveBoats() {
    for (let boat of gameState.boats) {
      boat.x += boat.speed;
      boat.wave += 0.02;
      if (boat.x > p.width + 100) {
        boat.x = -p.random(100, 200);
        boat.y = p.random(50, 150);
      }
    }
  }

  function checkCollisions() {
    if (!gameState.car || !gameState.parkingSpot) return;

    for (let o of gameState.obstacles) {
      if (checkCollision(gameState.car, o)) {
        if (!gameState.gameOver) playHorn();
        gameState.gameOver = true;
      }
    }

    for (let e of gameState.enemies) {
      if (checkCollision(gameState.car, e)) {
        if (!gameState.gameOver) playHorn();
        gameState.gameOver = true;
      }
      if (
        p.abs(e.x - gameState.parkingSpot.x) < 20 &&
        p.abs(e.y - gameState.parkingSpot.y) < 20
      ) {
        if (!gameState.gameOver) playEnemySiren();
        gameState.gameOver = true;
      }
    }

    for (let b of gameState.boats) {
      if (checkCollision(gameState.car, b)) {
        if (!gameState.gameOver) playHorn();
        gameState.gameOver = true;
      }
    }

    for (let fake of gameState.fakeParkingSpots) {
      if (
        p.abs(gameState.car.x - fake.x) < 25 &&
        p.abs(gameState.car.y - fake.y) < 20
      ) {
        if (!gameState.gameOver) playHorn();
        gameState.gameOver = true;
      }
    }
  }

  function checkCollision(
    obj1: Car | Obstacle | Enemy | Boat,
    obj2: Car | Obstacle | Enemy | Boat
  ): boolean {
    let dx = p.abs(obj1.x - obj2.x);
    let dy = p.abs(obj1.y - obj2.y);
    let xLimit = obj1.w / 2 + obj2.w / 2;
    let yLimit = obj1.h / 2 + obj2.h / 2;
    return dx < xLimit && dy < yLimit;
  }

  function checkParking() {
    if (!gameState.car || !gameState.parkingSpot) return;
    let dx = p.abs(gameState.car.x - gameState.parkingSpot.x);
    let dy = p.abs(gameState.car.y - gameState.parkingSpot.y);
    let dAngle = p.abs(gameState.car.angle % (2 * p.PI));
    if (dx < 18 && dy < 18 && dAngle < 0.4) {
      if (!gameState.win) playWinTone();
      gameState.win = true;
    }
  }

  function playHorn() {
    if (audioStarted && hornGain) {
      hornGain.gain.setTargetAtTime(0.2, audioContext.currentTime, 0.05);
      setTimeout(
        () => hornGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.1),
        200
      );
    }
  }

  function playWinTone() {
    if (audioStarted && winGain) {
      winGain.gain.setTargetAtTime(0.2, audioContext.currentTime, 0.05);
      setTimeout(
        () => winGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.1),
        300
      );
    }
  }

  function playEnemySiren() {
    if (audioStarted && enemyGain) {
      enemyGain.gain.setTargetAtTime(0.2, audioContext.currentTime, 0.05);
      setTimeout(
        () => enemyGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.1),
        300
      );
    }
  }

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

  function playBackgroundMusic() {
    console.log(audioStarted);
    console.log(musicOsc);
    console.log(bassOsc);
    console.log(audioContext);

    if (!audioStarted || !musicOsc || !bassOsc || !audioContext) return;

    const melody = [
      440, 523, 659, 523, 440, 392, 440, 523, 659, 784, 659, 523, 440, 523, 440,
      392,
    ];
    const bassPattern = [110, 110, 146, 146, 110, 110, 146, 146];

    let noteIndex = 0;
    let bassIndex = 0;

    function playNextNote() {
      console.log("suono prossima nota");
      if (audioStarted && musicOsc && bassOsc && audioContext) {
        musicOsc.frequency.setValueAtTime(
          melody[noteIndex],
          audioContext.currentTime
        );
        bassOsc.frequency.setValueAtTime(
          bassPattern[bassIndex],
          audioContext.currentTime
        );
        noteIndex = (noteIndex + 1) % melody.length;
        bassIndex = (bassIndex + 1) % bassPattern.length;
      }
    }

    setInterval(playNextNote, 400);
  }
};

// Initialize p5.js
new p5(sketch);
