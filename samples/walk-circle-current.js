var radius=30.0;
var speed=20.0; // units/sec

const pi = Math.PI;
const radPerDegree = pi/180.0;
const degreePerRad = 180.0 / pi;

var pathLength = 2 * pi * radius;
var totalTimeNeeded = pathLength / speed;

var x = radius;
var y = 0.0;
var heading = 90 * radPerDegree; // pi/2

var timeTravelled = 0;
var numParts = 30.0 ; // 100.0;
var timeSlice = totalTimeNeeded / numParts;
var arcSlice = pi * 2 / numParts;
var arcTravelled = 0;
var arcNextTravelled;

var dx, dy;
var desiredX = x, desiredY = y;
var newHeading;
var radiusPart = radius / numParts;

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

async function blinkLights(colorEntry, numBlinks, delayTime) {
	for (var i = 0; i < numBlinks; i++) {
		setMainLed({r: colorEntry[0], g: colorEntry[1], b: colorEntry[2]});
		await delay(delayTime);
		setMainLed({r: 0, g: 0, b: 0});
		await delay(delayTime);
	}
	setMainLed({r: colorEntry[0], g: colorEntry[1], b: colorEntry[2]});
}

async function processNextSlice() {
    sliceIndex += 1;
    if (sliceIndex >= numParts) {
        stopRoll();
        await blinkLights([255, 216, 177], 7, 0.05);
		updateColor(colors.length - 1);
        return;
    }
    updateColor(sliceIndex);
    var location = getLocation();
    x = location.x;
    y = location.y;
    arcTravelled = sliceIndex * arcSlice;
    arcNextTravelled = (sliceIndex + 1) * arcSlice;
    desiredX = radius * Math.cos(arcNextTravelled);
    desiredY = radius * Math.sin(arcNextTravelled);
    newHeading = Math.atan2(desiredY - y, desiredX - x);
    heading = newHeading;
    setHeading(newHeading * degreePerRad);
    setTimeout(processNextSlice, timeSlice * 1000);
}

async function startProgram() {
    updateColor(0);
    setSpeed(speed);
    //var timeToMove = x / speed;
    await roll(0, speed, x /speed);
    stopRoll();
	await blinkLights([255, 255, 0], 6, 0.05);
    
    // Now start the circle
    setTimeout(processNextSlice, timeSlice * 1000);
    await roll(0, speed, 30);
	await blinkLights([0, 255, 0], 12, 0.05);
	updateColor([0,0,0]);
	endProgram();
}
