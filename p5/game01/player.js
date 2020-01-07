class Player 
{
    constructor(position)
    {
        this.position = position;
    }

    handleMovement() {
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

        var movement = createVector(horizontalInput, -verticalInput);
        movement.normalize();
        movement.mult(MOVE_SPEED);
        if (checkPhysics(this, this.position.copy().add(createVector(movement.x, 0)), PLAYER_SIZE, false)) {
            movement.x = 0;
        }
        if (checkPhysics(this, this.position.copy().add(createVector(0, movement.y)), PLAYER_SIZE, false)) {
            movement.y = 0;
        }
        this.position.add(movement);
    }

    draw() {
        noStroke();
        rectMode(CENTER);
        fill(255, 50, 50);
        rect(this.position.x, this.position.y, PLAYER_SIZE, PLAYER_SIZE);
    }
}