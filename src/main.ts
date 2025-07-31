import "./style.css";
//

let car;
let parkingSpot;
let obstacles = [];
let boats = [];
let enemies = [];
let fakeParkingSpots = [];
let level = 1;
let gameOver = false;
let win = false;

let audioContext;
let motorGain, hornGain, winGain, enemyGain, musicGain;
let motorOsc, hornOsc, winOsc, enemyOsc, musicOsc, bassOsc;

let playerName = "";
let nameInput, playButton;
let gameState = "menu";
let audioStarted = false;

function setup() {
  createCanvas(1000, 700);
  nameInput = createInput("");
  nameInput.position(width / 2 - 100, height / 2 + 50);
  nameInput.size(200);
  nameInput.attribute("placeholder", "Nome Pilota");
  styleInput(nameInput);

  playButton = createButton("START");
  playButton.position(width / 2 - 60, height / 2 + 100);
  styleButton(playButton);
  playButton.mousePressed(startGame);

  textAlign(CENTER);
  textFont("Open Sans");
}

function startGame() {
  if (!audioStarted) {
    audioStarted = true;
    initAudio();
  }
  playerName = nameInput.value() || "Player";
  nameInput.hide();
  playButton.hide();
  gameState = "playing";
  startLevel(level);
}

function styleInput(el) {
  el.style("background", "#111");
  el.style("border", "2px solid #00FF00");
  el.style("color", "#00FF00");
  el.style("padding", "8px");
  el.style("font-family", "Courier New, monospace");
}

function styleButton(el) {
  el.style("background", "#000");
  el.style("border", "2px solid #00FF00");
  el.style("color", "#00FF00");
  el.style("padding", "10px 20px");
  el.style("font-family", "Courier New, monospace");
  el.style("font-size", "16px");
  el.style("cursor", "pointer");
}

function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
function startLevel(lvl) {
  car = { x: 120, y: 550, w: 48, h: 24, speed: 2.5, angle: 0 };
  parkingSpot = generateParkingSpot(lvl);
  obstacles = [];
  boats = [];
  fakeParkingSpots = [];
  enemies = [];

  generateFakeParkingSpots(lvl);

  for (let i = 0; i < 8 + lvl; i++) {
    obstacles.push(generateObstacle(i));
  }

  for (let i = 0; i < 3; i++) {
    boats.push(generateBoat());
  }

  for (let i = 0; i < 2; i++) {
    enemies.push({
      x: -150 * (i + 1),
      y: 150 + i * 200,
      w: 48,
      h: 24,
      speed: 1.2 + lvl * 0.1,
      col: color(255, 50, 50),
    });
  }

  gameOver = false;
  win = false;
}

function draw() {
  background(0);

  if (gameState === "menu") {
    drawMenu();
    return;
  }

  drawCastle();
  drawFakeParkingSpots();
  drawParkingSpot();
  drawObstacles();
  drawEnemies();
  drawBoats();
  drawCar();

  if (!gameOver && !win && level <= 10) {
    moveCar();
    moveEnemies();
    moveBoats();
    checkCollisions();
    checkParking();
  }

  drawUI();
  drawMessages();
}

function drawMenu() {
  fill(255, 255, 0);
  stroke(255, 255, 0);
  strokeWeight(2);
  textSize(60);
  textAlign(CENTER, CENTER);
  text("MOLESTO", width / 2, height / 2 - 150);

  fill(0, 255, 0);
  noStroke();
  textSize(24);
  text("Il diritto al posto negato", width / 2, height / 2 - 100);

  fill(255, 255, 0);
  textSize(18);
  text("REGOLE DEL GIOOCO ", width / 2, height / 2 - 70);
  textSize(15);
  text("OBBIETTIVO: Parcheggia nel posto GIALLO", width / 2, height / 2 - 50);
  text("Evita i parcheggi ROSSI (sono finti!)", width / 2, height / 2 - 30);
  text("Schiva barche e auto nemiche", width / 2, height / 2 - 10);
  text("Usa le frecce per muoverti", width / 2, height / 2 + 10);
  text("SOLO CHI VINCE PUO DECIDERE!", width / 2, height / 2 + 35);
}

function drawCastle() {
  let cx = width / 2;
  let cy = height / 2 - 50;

  push();
  translate(cx, cy);
  noStroke();

  fill(64);
  rect(-70, -20, 140, 60);

  fill(96);
  rect(-65, -15, 20, 10);
  rect(-40, -15, 20, 10);
  rect(-15, -15, 20, 10);
  rect(10, -15, 20, 10);
  rect(35, -15, 20, 10);

  fill(80);
  rect(-90, -50, 30, 70);
  fill(112);
  rect(-85, -45, 8, 8);
  rect(-75, -45, 8, 8);
  rect(-85, -30, 8, 8);
  rect(-75, -30, 8, 8);

  fill(96);
  rect(-90, -58, 6, 8);
  rect(-78, -58, 6, 8);
  rect(-66, -58, 6, 8);

  fill(80);
  rect(60, -50, 30, 70);
  fill(112);
  rect(65, -45, 8, 8);
  rect(75, -45, 8, 8);
  rect(65, -30, 8, 8);
  rect(75, -30, 8, 8);

  fill(96);
  rect(60, -58, 6, 8);
  rect(72, -58, 6, 8);
  rect(84, -58, 6, 8);

  fill(128);
  rect(-25, -70, 50, 90);
  fill(160);
  rect(-20, -65, 8, 8);
  rect(-8, -65, 8, 8);
  rect(4, -65, 8, 8);
  rect(16, -65, 8, 8);
  fill(96);
  rect(-20, -50, 8, 8);
  rect(16, -50, 8, 8);
  rect(-20, -35, 8, 8);
  rect(16, -35, 8, 8);

  fill(144);
  rect(-25, -78, 8, 8);
  rect(-12, -78, 8, 8);
  rect(1, -78, 8, 8);
  rect(14, -78, 8, 8);

  fill(32);
  rect(-12, 10, 24, 30);
  fill(48);
  rect(-10, 15, 4, 4);
  rect(-2, 15, 4, 4);
  rect(6, 15, 4, 4);

  fill(64, 32, 0);
  rect(-15, 35, 30, 8);
  pop();
}
function generateParkingSpot(lvl) {
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
  let i = min(lvl - 1, spots.length - 1);
  return { x: spots[i].x, y: spots[i].y, w: 60, h: 30 };
}

function generateFakeParkingSpots(lvl) {
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

  for (let i = 0; i < min(lvl + 2, spots.length); i++) {
    fakeParkingSpots.push({
      x: spots[i].x,
      y: spots[i].y,
      w: 50,
      h: 25,
      angle: spots[i].angle,
    });
  }
}

function generateObstacle(index) {
  let w = random(40, 60);
  let h = random(20, 35);
  let x = random(200, 800);
  let y = random(150, 500);
  let colors = [
    color(255, 0, 255),
    color(0, 255, 255),
    color(255, 255, 0),
    color(255, 100, 255),
    color(100, 255, 255),
  ];

  return {
    x,
    y,
    w,
    h,
    col: random(colors),
    type: index % 6 === 0 ? "palm" : index % 4 === 0 ? "lamp" : "car",
  };
}

function generateBoat() {
  return {
    x: random(-300, -50),
    y: random(50, 150),
    w: 60,
    h: 25,
    speed: random(0.8, 2.0),
    col: color(0, random(150, 255), 255),
    wave: random(0, TWO_PI),
  };
}

function drawFakeParkingSpots() {
  for (let i = 0; i < fakeParkingSpots.length; i++) {
    let spot = fakeParkingSpots[i];
    push();
    translate(spot.x, spot.y);
    rotate(spot.angle);
    rectMode(CENTER);
    stroke(255, 0, 0);
    strokeWeight(3);
    fill(80, 0, 0);
    rect(0, 0, spot.w, spot.h);
    noStroke();
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(16);
    text("X", 0, 0);
    pop();
  }
}

function drawParkingSpot() {
  push();
  translate(parkingSpot.x, parkingSpot.y);
  rectMode(CENTER);
  let pulse = sin(frameCount * 0.1) * 50 + 205;
  stroke(255, pulse, 0);
  strokeWeight(4);
  fill(100, 100, 0);
  rect(0, 0, parkingSpot.w, parkingSpot.h);
  noStroke();
  fill(255, 255, 0);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("P", 0, 0);
  pop();
}
function drawCar() {
  push();
  translate(car.x, car.y);
  rotate(car.angle);
  rectMode(CENTER);
  stroke(0, 255, 0);
  strokeWeight(2);
  fill(255);
  rect(0, 0, car.w, car.h);
  noStroke();
  fill(100, 150, 255);
  rect(0, -4, 28, 12);
  fill(40);
  rect(-car.w / 2 + 8, -car.h / 2, 8, 6);
  rect(car.w / 2 - 8, -car.h / 2, 8, 6);
  rect(-car.w / 2 + 8, car.h / 2, 8, 6);
  rect(car.w / 2 - 8, car.h / 2, 8, 6);
  fill(255, 255, 0);
  rect(car.w / 2 + 2, -car.h / 4, 4, 4);
  rect(car.w / 2 + 2, car.h / 4, 4, 4);
  pop();
}

function drawEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    drawPixelCar(enemies[i], true);
  }
}

function drawObstacles() {
  for (let obs of obstacles) {
    if (obs.type === "palm") drawPalm(obs.x, obs.y);
    else if (obs.type === "lamp") drawLamp(obs.x, obs.y);
    else drawPixelCar(obs, false);
  }
}

function drawPalm(x, y) {
  push();
  translate(x, y);
  noStroke();
  fill(101, 67, 33);
  rect(-5, -30, 10, 60);
  fill(0, 255, 0);
  ellipse(0, -40, 40, 20);
  ellipse(-15, -35, 30, 15);
  ellipse(15, -35, 30, 15);
  pop();
}

function drawLamp(x, y) {
  push();
  translate(x, y);
  noStroke();
  fill(128);
  rect(-3, -40, 6, 70);
  fill(255, 255, 0);
  ellipse(0, -42, 16, 16);
  pop();
}

function drawPixelCar(obj, isEnemy) {
  push();
  translate(obj.x, obj.y);
  rectMode(CENTER);
  stroke(isEnemy ? color(255, 0, 0) : color(0, 255, 255));
  strokeWeight(2);
  fill(obj.col);
  rect(0, 0, obj.w, obj.h);
  noStroke();
  fill(isEnemy ? color(255, 100, 100) : color(100, 150, 255));
  rect(0, -obj.h * 0.15, obj.w * 0.6, obj.h * 0.4);
  fill(40);
  rect(-obj.w / 2 + 6, -obj.h / 2 + 2, 8, 6);
  rect(obj.w / 2 - 6, -obj.h / 2 + 2, 8, 6);
  rect(-obj.w / 2 + 6, obj.h / 2 - 2, 8, 6);
  rect(obj.w / 2 - 6, obj.h / 2 - 2, 8, 6);
  fill(isEnemy ? color(255, 0, 0) : color(255, 255, 0));
  rect(obj.w / 2 - 2, -obj.h / 4, 4, 4);
  rect(obj.w / 2 - 2, obj.h / 4, 4, 4);
  if (isEnemy) {
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(12);
    text("!", 0, -obj.h / 3);
  }
  pop();
}

function drawBoats() {
  for (let boat of boats) {
    push();
    translate(boat.x, boat.y + sin(boat.wave + frameCount * 0.1) * 3);
    stroke(0, 255, 255);
    strokeWeight(2);
    fill(boat.col);
    ellipse(0, 0, boat.w, boat.h);
    noStroke();
    fill(255);
    triangle(-5, -15, 5, -25, 15, -5);
    fill(139, 69, 19);
    rect(-2, -25, 4, 25);
    pop();
  }
}

function drawUI() {
  fill(0);
  stroke(255, 255, 0);
  strokeWeight(2);
  rect(0, 0, width, 60);
  fill(255, 255, 0);
  noStroke();
  textSize(18);
  textAlign(LEFT);
  text("LIVELLO: " + level, 20, 25);
  text("PLAYER: " + playerName, 20, 45);
  textAlign(RIGHT);
  text("MOLA ARCADE", width - 20, 25);
}

function drawMessages() {
  textAlign(CENTER);
  if (win && level <= 10) {
    fill(0, 255, 0);
    stroke(0, 255, 0);
    strokeWeight(2);
    textSize(24);
    text("PARCHEGGIO RIUSCITO! Premi N", width / 2, 100);
  }
  if (level > 10) {
    fill(255, 255, 0);
    stroke(255, 255, 0);
    strokeWeight(2);
    textSize(32);
    text("VITTORIA TOTALE!", width / 2, height / 2);
    noStroke();
    textSize(20);
    text("Complimenti " + playerName + "!", width / 2, height / 2 + 40);
  }
  if (gameOver) {
    fill(255, 0, 0);
    stroke(255, 0, 0);
    strokeWeight(2);
    textSize(24);
    text("GAME OVER! Premi R", width / 2, 100);
  }
}
function moveCar() {
  let moving = false;

  if (keyIsDown(LEFT_ARROW)) {
    car.angle -= 0.06;
    moving = true;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    car.angle += 0.06;
    moving = true;
  }
  if (keyIsDown(UP_ARROW)) {
    car.x += cos(car.angle) * car.speed;
    car.y += sin(car.angle) * car.speed;
    moving = true;
  }
  if (keyIsDown(DOWN_ARROW)) {
    car.x -= cos(car.angle) * car.speed * 0.6;
    car.y -= sin(car.angle) * car.speed * 0.6;
    moving = true;
  }

  car.x = constrain(car.x, car.w / 2, width - car.w / 2);
  car.y = constrain(car.y, car.h / 2, height - 20);

  if (audioStarted && motorGain && audioContext) {
    motorGain.gain.setTargetAtTime(
      moving ? 0.1 : 0,
      audioContext.currentTime,
      0.1
    );
  }
}

function moveEnemies() {
  for (let e of enemies) {
    e.x += e.speed;
    if (e.x > width + 100) e.x = -150;
  }
}

function moveBoats() {
  for (let boat of boats) {
    boat.x += boat.speed;
    boat.wave += 0.02;
    if (boat.x > width + 100) {
      boat.x = -random(100, 200);
      boat.y = random(50, 150);
    }
  }
}

function checkCollisions() {
  for (let o of obstacles) {
    if (checkCollision(car, o)) {
      if (!gameOver) playHorn();
      gameOver = true;
    }
  }

  for (let e of enemies) {
    if (checkCollision(car, e)) {
      if (!gameOver) playHorn();
      gameOver = true;
    }
    if (abs(e.x - parkingSpot.x) < 20 && abs(e.y - parkingSpot.y) < 20) {
      if (!gameOver) playEnemySiren();
      gameOver = true;
    }
  }

  for (let b of boats) {
    if (checkCollision(car, b)) {
      if (!gameOver) playHorn();
      gameOver = true;
    }
  }

  for (let fake of fakeParkingSpots) {
    if (abs(car.x - fake.x) < 25 && abs(car.y - fake.y) < 20) {
      if (!gameOver) playHorn();
      gameOver = true;
    }
  }
}

function checkCollision(obj1, obj2) {
  let dx = abs(obj1.x - obj2.x);
  let dy = abs(obj1.y - obj2.y);
  let xLimit = obj1.w / 2 + obj2.w / 2;
  let yLimit = obj1.h / 2 + obj2.h / 2;
  return dx < xLimit && dy < yLimit;
}

function checkParking() {
  let dx = abs(car.x - parkingSpot.x);
  let dy = abs(car.y - parkingSpot.y);
  let dAngle = abs(car.angle % (2 * PI));
  if (dx < 18 && dy < 18 && dAngle < 0.4) {
    if (!win) playWinTone();
    win = true;
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

function keyPressed() {
  if ((key === "r" || key === "R") && gameOver) {
    startLevel(level);
  }
  if ((key === "n" || key === "N") && win && level < 11) {
    level++;
    startLevel(level);
  }
}

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

// import typescriptLogo from './typescript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.ts'

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
