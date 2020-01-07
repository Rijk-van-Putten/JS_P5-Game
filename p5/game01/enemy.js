class Enemy {
    constructor(position) {
        this.position = position;
        this.health = MAX_HEALTH;
    }

    update(playerPos) {
        var movement = playerPos.copy().sub(this.position);
        movement.normalize();
        movement.mult(ENEMY_SPEED);
        if (checkPhysics(this, this.position.copy().add(createVector(movement.x, 0)), ENEMY_SIZE, true)) {
            currentHealth -= 2;
            movement.x = 0;
        }
        if (checkPhysics(this, this.position.copy().add(createVector(0, movement.y)), ENEMY_SIZE, true)) {
            currentHealth -= 2;
            movement.y = 0;
        }
        this.position.add(movement);
    }

    dealDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
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
