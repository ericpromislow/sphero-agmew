var heading;

async function changeDirection() {
	setMainLed({ r: 255, g: 0, b: 0});
	heading -= 180;
    setHeading(heading);
	await roll(heading, speed, timeInSeconds);
	exitProgram();
}

async function startProgram() {
    setMainLed({ r: 0, g: 0, b: 255});
	var speed = 40;
	var timeInSeconds = 3;
    setSpeed(speed);
    heading = 0;
    setHeading(heading);
    setTimeout(changeDirection, (timeInSeconds / 2.5) * 1000);
    await roll(heading, speed, timeInSeconds);
	setMainLed({ r: 0, g: 255, b: 0});
}
