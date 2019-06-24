var radius = 40.0;
var speed = 40.0; // units/sec

const pi = Math.PI;
const radPerDegree = pi/180.0;
const degreePerRad = 180.0 / pi;

var pathLength = 2 * pi * radius;
var totalTimeNeeded = pathLength / speed;

var x = radius;
var y = 0.0;
var headingDeg = 90;
var headingRad = headingDeg * radPerDegree; // pi/2

var timeTravelled = 0;
var numParts = 30.0 ; // 100.0;
var timeSlice = totalTimeNeeded / numParts;
var arcSlice = pi * 2 / numParts;
var arcTravelled = 0;
var arcNextTravelled;

var dx, dy;
var desiredX = x, desiredY = y;
var newHeadingRad;
var newHeadingDeg;

var colorIndex = -1;
var sliceIndex = -1;

// stubs:

function roll(headingDeg, speed, timeToMove) {
    console.log("** roll: " +
                " heading: " + headingDeg +
                ", speed: " + speed +
                ", timeToMove:"  + timeToMove);
}    

function stopRoll() {
    console.log("** stop roll");
}

function exitProgram() {
    console.log("** exitProgram");
}

function setSpeed(speed) {
    console.log("** set speed to " + speed);
}

function updateColor(index) {
    console.log("** emitting color " + index % 25);
}

function blinkLights(colorEntry, numBlinks, delayTime) {
    console.log("blinking lights...");
}

function getLocation() {
    var vx = speed * Math.cos(headingRad);
    var vy = speed * Math.sin(headingRad);
    var dx = vx * timeSlice;
    var dy = vy * timeSlice;
    if (sliceIndex < 5) {
    console.log("getLocation: " +
                ", heading (deg): " + headingDeg +
                ", speed: " + speed +
                ", x: " + x +
                ", vx: " + vx +
                ", dx: " + dx +
                ", y: " + y +
                ", vy: " + vy +
                ", dy: " + dy);
    }
    return { x: x + dx, y : y + dy };
}

function setHeading(headingDeg) {
    console.log("setting heading to " + headingDeg + " deg (" + (headingDeg * radPerDegree) + " rad)");
}

async function processNextSlice() {
    sliceIndex += 1;
    if (sliceIndex > numParts) {
        stopRoll();
        blinkLights([255, 216, 177], 7, 0.05);
		updateColor(24);
        exitProgram();
        return;
    }
    updateColor(sliceIndex);
    var location = getLocation();
    x = location.x;
    y = location.y;
    arcTravelled = (sliceIndex + 0) * arcSlice;
    arcNextTravelled = (sliceIndex + 1) * arcSlice;
    desiredX = radius * Math.cos(arcNextTravelled);
    desiredY = radius * Math.sin(arcNextTravelled);
    console.log("At degrees: " + (arcTravelled * degreePerRad) +
                ", x: " + x +
                ", y: " + y +
                ", next degrees: " + (arcNextTravelled * degreePerRad) +
                "; want x: " + desiredX +
                ", y: " + desiredY);
    console.log("");
    newHeadingRad = Math.atan2(desiredY - y, desiredX - x);
    headingRad = newHeadingRad;
    headingDeg = newHeadingRad * degreePerRad;
    setHeading(headingDeg);
    setTimeout(processNextSlice, timeSlice * 1000);
}

function startProgram() {
    updateColor(0);
    setSpeed(speed);
    var timeToMove = x / speed;
    roll(0, speed, timeToMove);
    stopRoll();
    headingDeg = headingRad = 0;
    console.log("Initially x: " + x +
                ", y: " + y);
	blinkLights([255, 255, 0], 6, 0.05);
    
    // Now start the circle
    setTimeout(processNextSlice, timeSlice * 1000);
    headingDeg = 90; //  - (arcSlice / 1 * degreePerRad);
    headingRad = headingDeg * radPerDegree;
    roll(headingDeg, speed, totalTimeNeeded);
}

startProgram();
