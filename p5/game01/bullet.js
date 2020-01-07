class Bullet {
    constructor(position, direction) {
        this.position = position;
        this.direction = direction;
    }

    update() {
        var movement = this.direction.copy().mult(BULLET_SPEED);
        this.position.add(movement);
        let enemy = checkPhysicsSimple(this.position, BULLET_SIZE);
        if (enemy != null) { // Hit!!
            if (enemy.dealDamage(BULLET_DAMGE)) // Deal the damage
            {
                // Remove from array if died
                var index1 = enemies.indexOf(enemy);
                if (index1 >= 0)
                {
                    enemies.splice(index1, 1); 
                }
            }
            // Remove bullet from array
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