// include "spherolib.js"

var radius = 80.0;
var moveOut = 80.0;
var speed = 40.0; // units/sec

var x = radius;
var y = 0.0;

var colors = [
    [230, 25, 75],
[60, 180, 75],
[255, 225, 25],
[67, 99, 216],
[245, 130, 49],
	
[145, 30, 180],
[70, 240, 240],
[240, 50, 230],
[188, 246, 12],
[250, 190, 190],
[0, 128, 128],
[230, 190, 255],
[154, 99, 36],
[255, 250, 200],
[128, 0, 0],
[170, 255, 195],
[128, 128, 0],
[255, 216, 177],
[0, 0, 117],
[128, 128, 128],
[255, 255, 255]
              ];

var colorIndex = -1;
var sliceIndex = -1;

function updateColor(index) {
    var colorEntry = colors[index % colors.length];
    setMainLed({ r: colorEntry[0], g: colorEntry[1], b: colorEntry[2]});
}

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
