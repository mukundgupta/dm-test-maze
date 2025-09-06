let player;
let walls = [];

function setup() {
  createCanvas(400, 400);

  // Maze offset (center the whole maze in the canvas)
  let offsetX = width / 2 - 200 / 2; // 200 = approx maze width
  let offsetY = height / 2 - 200 / 2; // 200 = approx maze height

  // Player sprite
  player = createSprite(offsetX + 30, offsetY + 30, 20, 20);
  player.shapeColor = color(0, 0, 255);

  // Walls (add offsetX, offsetY to all coordinates)
  walls.push(createSprite(offsetX + 100, offsetY + 150, 20, 300));
  walls.push(createSprite(offsetX + 200, offsetY + 250, 20, 300));
  walls.push(createSprite(offsetX + 150, offsetY + 200, 300, 20));

  walls.forEach(w => (w.immovable = true));
}

function draw() {
  background(220);

  // Movement toward touch or mouse
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
      player.position.x += (dx / mag) * 10;
      player.position.y += (dy / mag) * 10;
    }
  }

  // Collisions
  walls.forEach(w => player.collide(w));

  drawSprites();
}
