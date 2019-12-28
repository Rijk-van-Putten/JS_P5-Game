const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 800;
const FRAME_RATE = 60;
const DELTA_TIME = 1 / FRAME_RATE;
const MOVE_SPEED = 4;
const BULLET_SIZE = 12;
const BULLET_SPEED = 6;
const FIRE_DELAY = 0.04;
const ENEMY_SIZE = 64;
const ENEMY_SPEED = 2;
const PLAYER_SIZE = 64;

var playerPos;
var bullets = [];
var enemies = [];
var fireCountdown = 0;

class Bullet {
    constructor(position, direction) {
        this.position = position;
        this.direction = direction;
    }

    update() {
        var movement = this.direction.copy().mult(BULLET_SPEED);
        this.position.add(movement);
        var enemy = checkPhysics(this.position, BULLET_SIZE);
        if (enemy != null) {
            var index1 = enemies.indexOf(enemy);
            if (index1 >= 0)
                enemies.splice(index1, 1); 
            var index2 = bullets.indexOf(this);
            if (index2 >= 0)
                bullets.splice(index2, 1);
        }
    }

    draw() {
        fill('orange');
        rect(this.position.x, this.position.y, BULLET_SIZE, BULLET_SIZE);
    }
}

class Enemy {
    constructor(position) {
        this.position = position;
    }

    update(playerPosition) {
        var movement = playerPos.copy().sub(this.position);
        movement.normalize();
        movement.mult(ENEMY_SPEED);
        if (checkPhysics(this, this.position.copy().add(createVector(movement.x, 0)), ENEMY_SIZE, true)) {
            movement.x = 0;
        }
        if (checkPhysics(this, this.position.copy().add(createVector(0, movement.y)), ENEMY_SIZE, true)) {
            movement.y = 0;
        }
        this.position.add(movement);
    }

    draw() {
        rectMode(CENTER);
        fill('brown');
        rect(this.position.x, this.position.y, ENEMY_SIZE, ENEMY_SIZE);
    }

    getPos() {
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
    if (checkPhysics(this, playerPos.copy().add(createVector(movement.x, 0)), PLAYER_SIZE, false)) {
        movement.x = 0;
    }
    if (checkPhysics(this, playerPos.copy().add(createVector(0, movement.y)), PLAYER_SIZE, false)) {
        movement.y = 0;
    }
    playerPos.add(movement);

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

    noStroke();
    rectMode(CENTER);
    fill(255, 50, 50);
    rect(playerPos.x, playerPos.y, PLAYER_SIZE, PLAYER_SIZE);

    drawBullets();

}

function updateEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].update(playerPos);
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

function fire() {
    fireCountdown = FIRE_DELAY;

    let direction = createVector(mouseX, mouseY).sub(playerPos);
    direction.normalize();
    bullets.push(new Bullet(createVector(playerPos.x, playerPos.y), direction));
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
        colliders.push(new AABB(null, playerPos.x - PLAYER_SIZE / 2, playerPos.x + PLAYER_SIZE / 2,
            playerPos.y - PLAYER_SIZE / 2, playerPos.y + PLAYER_SIZE / 2));
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

// function checkPhysics(position, size) {
//     var colliders = [];
//     for (var i = 0; i < enemies.length; i++) {
//         colliders.push(new AABB(enemies[i], enemies[i].getPos().x - ENEMY_SIZE / 2, enemies[i].getPos().x + ENEMY_SIZE / 2,
//             enemies[i].getPos().y - ENEMY_SIZE / 2, enemies[i].getPos().y + ENEMY_SIZE / 2));
//     }

//     var points = [];
//     points.push(createVector(position.x + size / 2, position.y + size / 2));
//     points.push(createVector(position.x + size / 2, position.y - size / 2));
//     points.push(createVector(position.x - size / 2, position.y + size / 2));
//     points.push(createVector(position.x - size / 2, position.y - size / 2));

//     for (var j = 0; j < colliders.length; j++) {
//         for (var k = 0; k < points.length; k++) {
//             if (points[k].x >= colliders[j].x1 && points[k].x <= colliders[j].x2) {
//                 if (points[k].y >= colliders[j].y1 && points[k].y <= colliders[j].y2) {
//                     return colliders[j].object;
//                 }
//             }
//         }
//     }

//     return null;
// }

function drawColliders(colliders) {
    for (var i = 0; i < colliders.length; i++) {
        rectMode(CORNER);
        fill("purple");
        rect(colliders[i].x1, colliders[i].y1, colliders[i].x2 - colliders[i].x1, colliders[i].y2 - colliders[i].y1);
    }
}