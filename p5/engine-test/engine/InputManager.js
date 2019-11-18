
class InputManager
{
    static mousePressed() {
        console.log("MOUSE PRESSED!");
        InputManager.mousePressed = true;
    }

    static mouseReleased()
    {
        console.log("MOUSE RELEASED!");
        InputManager.mousePressed = false;
    }
}