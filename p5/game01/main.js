const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;
const MOVE_SPEED = 4;
var position;
var bullets


class Bullet
{
    constructor
    {
        this.x = 0;
        this.y = 0;
    }
}


function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  frameRate(60);
  position = createVector(100, 100);
}


function draw() {
    var horizontalInput = 0;
    if (keyIsDown(LEFT_ARROW))
        horizontalInput = -1;
    else if (keyIsDown(RIGHT_ARROW))
        horizontalInput = 1;
    else
        horizontalInput = 0;
    var verticalInput = 0;
    if (keyIsDown(DOWN_ARROW))
        verticalInput = -1;
    else if (keyIsDown(UP_ARROW))
        verticalInput = 1;
    else
        verticalInput = 0;

    var movement = createVector(horizontalInput, -verticalInput);
    movement.normalize();
    movement.mult(MOVE_SPEED);
    position.add(movement);
    background(240,240,240);
    noStroke();
    fill(255, 50, 50);
    ellipse(position.x, position.y, 64);
}

function mousePressed() {

}