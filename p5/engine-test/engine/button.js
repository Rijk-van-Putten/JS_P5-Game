/*
let font
function preload() {
  font = loadFont('assets/fonts/BebasNeue-Regular.otf');
}
*/
class Button
{
    constructor(text, size, x, y) {
        this.text = text;
        this.size = size;
        this.x = x;
        this.y = y;
    }

    draw()
    {
        let c = color(255, 204, 0); 
        fill(c); 
        noStroke();
        rect(this.x, this.y, 200, 55);
        c = color(0, 0, 0); 
        fill(c); 
        textSize(this.size);
        textFont("Arial");
        text(this.text, this.x, this.y);
    }
}
// USE THIS:
// https://p5js.org/examples/input-mouse-functions.html