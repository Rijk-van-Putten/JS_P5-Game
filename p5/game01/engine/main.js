function setup() {
  createCanvas(640, 480);
}

function mousePressed(event) {
    button.setMouse(true);
}

function mouseReleased() {
  locked = false;
}


function draw() {/*
  if (mouseIsPressed) {
    fill(0);
  } else {
    fill(255);
  }
  ellipse(mouseX, mouseY, 80, 80);
  */
    button = new Button("text", 24, 400, 400, 200, 50);
    button.update();
    button.draw();

 // myText = new Text("Dit is een coole text!!", 24, 10, 40);
//  myText.draw();
}