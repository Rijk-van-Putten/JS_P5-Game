const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 800;
const FRAME_RATE = 60;
const DELTA_TIME = 1 / FRAME_RATE;

const MOVE_SPEED = 4;

const BULLET_SIZE = 12;
const BULLET_SPEED = 6;
const FIRE_DELAY = 0.06;

const ENEMY_SIZE = 64;
const ENEMY_SPEED = 2;

const PLAYER_SIZE = 64;
const MAX_HEALTH = 100;
const BULLET_DAMGE = 5;

const HEALTHBAR_EDGE = 5;
const HEALTHBAR_WIDTH = 300;
const HEALTHBAR_HEIGHT = 60;
const HUD_PADDING = 10;

var player;
var bullets = [];
var enemies = [];
var fireCountdown = 0;
var currentHealth = MAX_HEALTH;

let squareFont;

function preload() {
  squareFont = loadFont('assets/Square.ttf');
}

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL);
    frameRate(60);
    cursor('assets/cursor.png', 16, 16);
    
    textFont(squareFont);

    player = new Player(createVector(100, 100));

    enemies.push(new Enemy(createVector(200, 300)));
    enemies.push(new Enemy(createVector(700, 500)));
    enemies.push(new Enemy(createVector(500, 300)));
    enemies.push(new Enemy(createVector(600, 900)));
}


function draw() {
    camera(1, 1, 1);

    player.handleMovement();

    if (fireCountdown > 0) {
        fireCountdown -= DELTA_TIME;
    }
    else if (mouseIsPressed && mouseButton == LEFT) {
        fire();
    }

    background(240, 240, 240);
    updateBullets();
    updateEnemies();

    drawEnemies();

    player.draw();

    drawBullets();
    drawHealthbar();

    if (currentHealth <= 0) {
        gameOver();
    }
}


function gameOver()
{
    console.log("GAME OVER!");
    noLoop();
}

function updateEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update(player.position);
    }
}

function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].draw();
    }
}

function updateBullets() {
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].update();
    }
}

function drawBullets() {
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].draw();
    }
}

function drawHealthbar() {
    noStroke();
    rectMode(CORNER);
    // Healthbar background
    fill(50, 50, 50);
    rect(HUD_PADDING, CANVAS_HEIGHT - HEALTHBAR_HEIGHT - HUD_PADDING, HEALTHBAR_WIDTH, HEALTHBAR_HEIGHT);
    // Healthbar fill
    fill('green');
    rect(HUD_PADDING + HEALTHBAR_EDGE, CANVAS_HEIGHT - HEALTHBAR_HEIGHT - HUD_PADDING + HEALTHBAR_EDGE, 
        HEALTHBAR_WIDTH / MAX_HEALTH * currentHealth - 2*HEALTHBAR_EDGE, // width
        HEALTHBAR_HEIGHT - 2*HEALTHBAR_EDGE); // height
    // Text
    textSize(32);
    fill(255, 255, 255);
    rectMode(CORNER);
    text(currentHealth, HUD_PADDING + HEALTHBAR_EDGE, CANVAS_HEIGHT - HUD_PADDING/2 - HEALTHBAR_EDGE/2 - 16);
}

function fire() {
    fireCountdown = FIRE_DELAY;

    let direction = createVector(mouseX, mouseY).sub(player.position);
    direction.normalize();
    bullets.push(new Bullet(createVector(player.position.x, player.position.y).add(direction.copy().mult(PLAYER_SIZE / 2 + BULLET_SIZE / 2)), 
                direction));
}

class AABB {
    constructor(object, x1, x2, y1, y2) {
        this.object = object;
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
}

function checkPhysics(self, position, size, collideWithPlayer) {
    var colliders = [];
    for (var i = 0; i < enemies.length; i++) {
        if (self == enemies[i])
            continue;

        colliders.push(new AABB(enemies[i], enemies[i].getPos().x - ENEMY_SIZE / 2, enemies[i].getPos().x + ENEMY_SIZE / 2,
            enemies[i].getPos().y - ENEMY_SIZE / 2, enemies[i].getPos().y + ENEMY_SIZE / 2));
    }
    if (collideWithPlayer) {
        colliders.push(new AABB(null, player.position.x - PLAYER_SIZE / 2, player.position.x + PLAYER_SIZE / 2,
            player.position.y - PLAYER_SIZE / 2, player.position.y + PLAYER_SIZE / 2));
    }

    var points = [];
    points.push(createVector(position.x + size / 2, position.y + size / 2));
    points.push(createVector(position.x + size / 2, position.y - size / 2));
    points.push(createVector(position.x - size / 2, position.y + size / 2));
    points.push(createVector(position.x - size / 2, position.y - size / 2));

    for (var j = 0; j < colliders.length; j++) {
        for (var k = 0; k < points.length; k++) {
            if (points[k].x >= colliders[j].x1 && points[k].x <= colliders[j].x2) {
                if (points[k].y >= colliders[j].y1 && points[k].y <= colliders[j].y2) {
                    return true;
                }
            }
        }
    }

    return false;
}

function checkPhysicsSimple(position, size) {
    var colliders = [];
    for (var i = 0; i < enemies.length; i++) {
        colliders.push(new AABB(enemies[i], enemies[i].getPos().x - ENEMY_SIZE / 2, enemies[i].getPos().x + ENEMY_SIZE / 2,
            enemies[i].getPos().y - ENEMY_SIZE / 2, enemies[i].getPos().y + ENEMY_SIZE / 2));
    }

    var points = [];
    points.push(createVector(position.x + size / 2, position.y + size / 2));
    points.push(createVector(position.x + size / 2, position.y - size / 2));
    points.push(createVector(position.x - size / 2, position.y + size / 2));
    points.push(createVector(position.x - size / 2, position.y - size / 2));

    for (var j = 0; j < colliders.length; j++) {
        for (var k = 0; k < points.length; k++) {
            if (points[k].x >= colliders[j].x1 && points[k].x <= colliders[j].x2) {
                if (points[k].y >= colliders[j].y1 && points[k].y <= colliders[j].y2) {
                    return colliders[j].object;
                }
            }
        }
    }

    return null;
}

function drawColliders(colliders) {
    for (var i = 0; i < colliders.length; i++) {
        rectMode(CORNER);
        fill("purple");
        rect(colliders[i].x1, colliders[i].y1, colliders[i].x2 - colliders[i].x1, colliders[i].y2 - colliders[i].y1);
    }
}