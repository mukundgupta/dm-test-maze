let player;
let walls = [];

function setup() {
  createCanvas(500, 500);



  // Player sprite
  player = createSprite(30, 30, 20, 20);
  player.shapeColor = color(0, 0, 255);

  // Walls 
  walls.push(createSprite(340,  150, 20, 300));
  walls.push(createSprite( 200,  250, 20, 300));
  walls.push(createSprite( 150,  200, 300, 20));

  walls.forEach(w => (w.immovable = true));
}

function draw() {
  background(220);

  // Movement toward touch 
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
      player.position.x += (dx / mag) * 15;
      player.position.y += (dy / mag) * 15;
    }
  }

  // Collisions
  walls.forEach(w => player.collide(w));

  drawSprites();
}
