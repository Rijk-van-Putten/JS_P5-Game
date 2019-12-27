const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 800;
const FRAME_RATE = 60;
const DELTA_TIME = 1/FRAME_RATE;
const MOVE_SPEED = 4;
const BULLET_SPEED = 6;
const FIRE_DELAY = 0.04;
const ENEMY_SIZE = 64;
const PLAYER_SIZE = 64;

var playerPos;
var bullets = [ ];
var enemies = [ ];
var fireCountdown = 0;

class Bullet
{
    constructor(position, direction)
    {
        this.position = position;
        this.direction = direction;
    }

    update()
    {
        this.position.add(this.direction.copy().mult(BULLET_SPEED));
    }

    draw()
    {
        fill('black');
        ellipse(this.position.x, this.position.y, 12);
    }
}

class Enemy
{
    constructor(position)
    {
        this.position = position;
    }
    
    update(playerPosition)
    {
        var movement = playerPos.copy().sub(this.position);
        movement.normalize();
        if (checkPhysics(this, this.position.copy().add(createVector(movement.x, 0))))
        {
            movement.x = 0;
        }
        if (checkPhysics(this, this.position.copy().add(createVector(0, movement.y))))
        {
            movement.y = 0;
        }
        this.position.add(movement);
    }
    
    draw()
    {
        rectMode(CENTER);
        fill('brown');
        rect(this.position.x, this.position.y, ENEMY_SIZE, ENEMY_SIZE);
    }

    getPos()
    {
        return this.position;
    }
}

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  frameRate(60);
  playerPos = createVector(100, 100);

  enemies.push(new Enemy(createVector(200, 300)));
  enemies.push(new Enemy(createVector(700, 500)));
  enemies.push(new Enemy(createVector(500, 300)));
  enemies.push(new Enemy(createVector(600, 900)));

}


function draw() {
    var horizontalInput = 0;
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65))
        horizontalInput = -1;
    else if (keyIsDown(RIGHT_ARROW) || keyIsDown(68))
        horizontalInput = 1;
    else
        horizontalInput = 0;
    var verticalInput = 0;
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83))
        verticalInput = -1;
    else if (keyIsDown(UP_ARROW) || keyIsDown(87))
        verticalInput = 1;
    else
        verticalInput = 0;
        
    // PLAYER MOVEMENT
    var movement = createVector(horizontalInput, -verticalInput);
    movement.normalize();
    movement.mult(MOVE_SPEED);
    playerPos.add(movement);
    
    if (fireCountdown > 0) {
        fireCountdown -= DELTA_TIME;
    }
    else if (mouseIsPressed && mouseButton == LEFT) {
        fire();
    }
    
    background(240,240,240);
    updateBullets();
    updateEnemies();
    
    drawBullets();
    drawEnemies();
    noStroke();
    fill(255, 50, 50);
    rectMode(CENTER);

    rect(playerPos.x, playerPos.y, PLAYER_SIZE, PLAYER_SIZE);
}

function updateEnemies()
{
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].update(playerPos);
    }
}

function drawEnemies()
{
    for(var i = 0; i < enemies.length; i++)
    {
        enemies[i].draw();
    }
}

function updateBullets()
{
    for(var i = 0; i < bullets.length; i++)
    {
        bullets[i].update();
    }
}

function drawBullets()
{
    for(var i = 0; i < bullets.length; i++)
    {
        bullets[i].draw();
    }
}

function fire() {
    fireCountdown = FIRE_DELAY;

    let direction = createVector(mouseX, mouseY).sub(playerPos);
    direction.normalize();
    bullets.push(new Bullet(createVector(playerPos.x, playerPos.y), direction));
}

class AABB
{
    constructor(x1, x2, y1, y2)
    {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;

    }
}

function checkPhysics(self, position)
{
    var colliders = [ ];
    for(var i = 0; i < enemies.length; i++)
    {
        if (self == enemies[i])
            continue;

        colliders.push(new AABB(enemies[i].getPos().x - ENEMY_SIZE/2, enemies[i].getPos().x + ENEMY_SIZE/2, 
                    enemies[i].getPos().y - ENEMY_SIZE/2, enemies[i].getPos().y + ENEMY_SIZE/2));
    }
  //  colliders.push(new AABB(playerPos.x - PLAYER_SIZE/2, playerPos.x + PLAYER_SIZE/2, 
 //                           playerPos.y - PLAYER_SIZE/2, playerPos.y + PLAYER_SIZE/2));
    
    var points = [];
    points.push(createVector(position.x + 32, position.y + 32));
    points.push(createVector(position.x + 32, position.y - 32));
    points.push(createVector(position.x - 32, position.y + 32));
    points.push(createVector(position.x - 32, position.y - 32));
    
    for(var i = 0; i < colliders.length; i++)
    {
        for(var j = 0; j < points.length; j++)
        {
            if (points[j].x >= colliders[i].x1 && points[j].x <= colliders[i].x2
                && points[j].y >= colliders[i].y1 && points[j].y <= colliders[i].y2);
            {
                return true;
            }
        }
    }
   
    return false;
}