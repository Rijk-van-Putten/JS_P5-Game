

class Text
{
    constructor(text, size, x, y)
    {
        this.text = text;
        this.size = size;
        this.x = x;
        this.y = y;
    }

    draw()
    {
        let c = color(0, 0, 0); 
        fill(c); 
        textSize(this.size);
        textFont("Arial");
        textAlign(CENTER);
        text(this.text, this.x, this.y);
    }
}