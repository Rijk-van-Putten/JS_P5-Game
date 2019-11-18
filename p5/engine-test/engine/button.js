/*
let font
function preload() {
  font = loadFont('assets/fonts/BebasNeue-Regular.otf');
}
*/
let mouseHover = false;
let mousePressed = false;
class Button
{
    constructor(text, fontSize, x, y, width, height) {
        this.text = text;
        this.fontSize = fontSize;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    update()
    {
        if (
            mouseX > this.x - (this.width / 2) &&
            mouseX < this.x + (this.width / 2) &&
            mouseY > this.y - (this.height / 2) &&
            mouseY < this.y + (this.height / 2))
        {
            mouseHover = true;
        }
        else
        {
            mouseHover = false;
        }
    }

    setMouse(value)
    {
        mousePressed = value;
    }

    draw()
    {
        let c;
        if (mousePressed)
        {
            c = color(200, 200, 200);
        }
        else if (mouseHover)
        {
            c = color(150, 150, 150);
        }
        else
        {
            c = color(100, 100, 100);
        }
        fill(c); 
        noStroke();
        rectMode(CENTER);
        rect(this.x, this.y, this.width, this.height);
        c = color(0, 0, 0); 
        fill(c); 
        textSize(this.fontSize);
        textFont("Arial");
        textAlign(CENTER);
        text(this.text, this.x, this.y);
    }
}
// USE THIS:
// https://p5js.org/examples/input-mouse-functions.html