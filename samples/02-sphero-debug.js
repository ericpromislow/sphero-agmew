
async function startProgram() {
    setMainLed({ r: 0, g: 0, b: 255});
    setSpeed(60);
    setHeading(90);
    await roll(0, 100, 5);
    setSpeed(0);
    var pos = getLocation();
    alert("x: " + pos.x + ", y:" + pos.y); 
    setSpeed(60);
    setHeading(-90);
    await roll(0, 100, 5);
    setSpeed(0);
    exitProgram();
}
