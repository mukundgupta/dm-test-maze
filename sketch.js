// sketch.js - blind maze: walls + background same color until endpoint reached
let player;
let walls = [];
let endpoint; // goal square

const gridSize = 50;
const rows = 10;
const cols = 10;

let maze = [
  [1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,1,0,0,0,1],
  [1,0,1,1,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,1,0,1],
  [1,1,1,1,1,1,0,1,0,1],
  [1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1],
  [1,1,1,1,1,1,1,1,1,1]
];

let revealed = false; // whether colors are revealed
let dragging = false;  // whether player is being dragged/touched

// Colors
let BLIND_BG;
let BG_REVEALED;
let WALL_REVEALED;
let PLAYER_COLOR;
let ENDPOINT_COLOR;

function setup() {
  createCanvas(cols * gridSize, rows * gridSize);

  // Colors
  BLIND_BG = color(40);           // same for canvas + walls initially (invisible maze)
  BG_REVEALED = color(240);      // revealed background
  WALL_REVEALED = color(60);     // revealed wall color (dark)
  PLAYER_COLOR = color(0, 76, 255); // blue
  ENDPOINT_COLOR = color(0, 200, 0); // green

  // Find a starting open cell (first open cell top-left)
  const start = findFirstOpen();
  player = createSprite(
    start.x * gridSize + gridSize / 2,
    start.y * gridSize + gridSize / 2,
    gridSize * 0.6,
    gridSize * 0.6
  );
  player.shapeColor = PLAYER_COLOR;

  // Find an endpoint (search from bottom-right for an open cell)
  const goal = findLastOpen();
  endpoint = createSprite(
    goal.x * gridSize + gridSize / 2,
    goal.y * gridSize + gridSize / 2,
    gridSize * 0.8,
    gridSize * 0.8
  );
  endpoint.shapeColor = ENDPOINT_COLOR;

  // Create walls from maze grid (immovable)
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) {
        let wall = createSprite(
          x * gridSize + gridSize / 2,
          y * gridSize + gridSize / 2,
          gridSize,
          gridSize
        );
        wall.immovable = true;
        walls.push(wall);
      }
    }
  }

  // Ensure initial sprite colors (walls will be colored each frame depending on revealed)
  player.shapeColor = PLAYER_COLOR;
  endpoint.shapeColor = ENDPOINT_COLOR;
}

function draw() {
  // background + wall colors depend on reveal state
  if (!revealed) {
    background(BLIND_BG);
    walls.forEach(w => w.shapeColor = BLIND_BG);
  } else {
    background(BG_REVEALED);
    walls.forEach(w => w.shapeColor = WALL_REVEALED);
  }

  // Keep player & endpoint their visible colors (player blue, endpoint green)
  player.shapeColor = PLAYER_COLOR;
  endpoint.shapeColor = ENDPOINT_COLOR;

  // Movement: only when dragging (touch started on player)
  let tx = undefined, ty = undefined;
  if (dragging) {
    if (touches.length > 0) {
      tx = touches[0].x;
      ty = touches[0].y;
    } else if (mouseIsPressed) {
      tx = mouseX;
      ty = mouseY;
    }
  }

  if (tx !== undefined && ty !== undefined) {
    // Move toward target with axis-separated sliding
    let dx = tx - player.position.x;
    let dy = ty - player.position.y;
    let mag = sqrt(dx * dx + dy * dy);
    if (mag > 1) {
      const speed = 6; // pixels per frame
      const vx = (dx / mag) * min(speed, mag);
      const vy = (dy / mag) * min(speed, mag);

      // Try X move and resolve collisions (slides along walls)
      player.position.x += vx;
      for (let w of walls) player.collide(w);

      // Try Y move and resolve collisions
      player.position.y += vy;
      for (let w of walls) player.collide(w);
    }
  }

  // Check win condition (player overlaps endpoint)
  if (!revealed && player.overlap(endpoint)) {
    revealed = true;
    dragging = false; // stop further dragging after reveal
  }

  // If revealed, show message
  if (revealed) {
    // Draw sprites then overlay message
    drawSprites();
    push();
    fill(0, 160, 0);
    textAlign(CENTER, CENTER);
    textSize(28);
    noStroke();
    text("🎉 You reached the goal! 🎉", width / 2, height * 0.05 + 10);
    pop();
    return;
  }

  drawSprites();
}

// Utility: find first open cell (top-left)
function findFirstOpen() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 0) return { x, y };
    }
  }
  // fallback
  return { x: 1, y: 1 };
}

// Utility: find last open cell (bottom-right)
function findLastOpen() {
  for (let y = rows - 1; y >= 0; y--) {
    for (let x = cols - 1; x >= 0; x--) {
      if (maze[y][x] === 0) return { x, y };
    }
  }
  // fallback
  return { x: cols - 2, y: rows - 2 };
}

// Start dragging only if initial touch/click is on the player
function mousePressed() {
  if (dist(mouseX, mouseY, player.position.x, player.position.y) < gridSize * 0.6) {
    dragging = true;
  }
}

function mouseReleased() {
  dragging = false;
}

function touchStarted() {
  // single-finger touch
  const tx = touches.length > 0 ? touches[0].x : mouseX;
  const ty = touches.length > 0 ? touches[0].y : mouseY;
  if (dist(tx, ty, player.position.x, player.position.y) < gridSize * 0.6) {
    dragging = true;
    return false; // prevent default scrolling on some browsers
  }
  return true;
}

function touchEnded() {
  dragging = false;
  return false;
}
