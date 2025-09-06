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

function setup() {
  createCanvas(cols * gridSize, rows * gridSize);

  // Player at entrance
  player = createSprite(1.5 * gridSize, 1.5 * gridSize, gridSize * 0.6, gridSize * 0.6);
  player.shapeColor = color(0, 0, 255);

  // Endpoint (bottom-right corner open space)
  endpoint = createSprite(
    (cols - 2) * gridSize + gridSize / 2,  // second last column
    (rows - 2) * gridSize + gridSize / 2,  // second last row
    gridSize * 0.8,
    gridSize * 0.8
  );
  endpoint.shapeColor = color(0, 200, 0); // green

  // Walls from maze grid
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (maze[y][x] === 1) {
        let wall = createSprite(
          x * gridSize + gridSize / 2,
          y * gridSize + gridSize / 2,
          gridSize,
          gridSize
        );
        wall.shapeColor = color(50);
        wall.immovable = true;
        walls.push(wall);
      }
    }
  }
}

function draw() {
  background(220);

  // Movement
  let tx, ty;
  if (touches.length > 0) {
    tx = touches[0].x;
    ty = touches[0].y;
  } else if (mouseIsPressed) {
    tx = mouseX;
    ty = mouseY;
  }

  if (tx !== undefined && ty !== undefined) {
    let dx = tx - player.position.x;
    let dy = ty - player.position.y;
    let mag = sqrt(dx * dx + dy * dy);
    if (mag > 1) {
      player.position.x += (dx / mag) * 3;
      player.position.y += (dy / mag) * 3;
    }
  }

  // Collisions
  walls.forEach(w => player.collide(w));

  // Check win condition (player touches endpoint)
  if (player.overlap(endpoint)) {
    fill(0, 200, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("🎉 You Win! 🎉", width / 2, height / 2);
    noLoop(); // stop the game
  }

  drawSprites();
}
