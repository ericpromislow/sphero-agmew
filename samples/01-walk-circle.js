// include "spherolib.js"

var radius = 80.0;
var moveOut = 80.0;
var speed = 40.0; // units/sec

var x = radius;
var y = 0.0;

var origLocation;
async function returnHome() {
    var location = sLoc2wCoords(getLocation());
    x = location.x;
    y = location.y;
	var dx = x - origLocation.x;
	var dy = y - origLocation.y;
    var newHeadingRad = calcHeadingInRads(dx, dy);
    var headingDeg = wRadToSDeg(newHeadingRad);
    //await speak(["d x ", roundVal(dx), ", d y ", roundVal(dy), ", rads ", roundVal(newHeadingRad), ", degrees", roundVal(headingDeg)].join(""), true);
	var distance = Math.sqrt(dx * dx + dy * dy);
	//registerEvent(EventType.onCollision, function() { exitProgram(); });
	updateColor(4);
	await roll(headingDeg, speed, distance / speed);
	setTimeout(stopRoll, (distance/speed) * 1000);
	updateColor(5);
}


async function startProgram() {
	origLocation = sLoc2wCoords(getLocation());
    updateColor(0);
    setSpeed(speed);
    var timeToMove = moveOut / speed;
    var headingRad = pi / 2;
    var headingDeg = wRadToSDeg(headingRad);
    await roll(headingDeg, speed, timeToMove);
    stopRoll();
	await blinkLights([255, 0, 0], 6, 0.05);

	setSpeed(speed);
    await spin(-90, 3);
	await blinkLights([0, 255, 0], 12, 0.05);
    
	await returnHome();
	updateColor(3);
	exitProgram();
}
