class Obstacle
{
    constructor(position, size) {
        this.position = position;
        this.size = size;
    }

    draw() {
        rectMode(CENTER);
        fill('grey');
        rect(this.position.x, this.position.y, this.size.x, this.size.y);
    }
}