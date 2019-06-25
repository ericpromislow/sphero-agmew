// include "spherolib.js"
// include "blockage-handler.js"

// This program has sphero run towards a wall. Check-collisions is on, but if it
// doesn't detect a full collision it should still deflect away.

var speed;
var blockageHandler, intervalHandler;

function setupBlockageHandler(headingRad, x, y, speed) {
    blockageHandler = new BlockageHandler(headingRad, x, y, speed);
    intervalHandler = setInterval(async function() {
		await blockageHandler.checkHeading();
	}, 500);
}

async function handleCollision() {
	await speak("bang");
	clearInterval(intervalHandler);
	var currentHeadingDeg = getHeading();
	var scatterDeg = 30 - Math.round(60 * Math.random());
	var newHeadingDeg = normalizeDegrees(currentHeadingDeg + 180 + scatterDeg);
	setHeading(newHeadingDeg);
	var newHeadingRad = sDegToWRad(newHeadingDeg);
	var loc = getWCoords();
	setupBlockageHandler(newHeadingRad, loc.x, loc.y, speed);
}

async function startProgram() {
	var origLocation = sLoc2wCoords(getLocation());
    var targetX = -300;
    var targetY = -200;
	speed = 50;
    updateColor(0);
    var distance = Math.sqrt(targetX * targetX + targetY * targetY);
	registerEvent(EventType.onCollision, handleCollision);
    setSpeed(speed);
    var timeToMove = distance / speed;
    var headingRad = calcHeadingInRads(targetX, targetY);
    var headingDeg = wRadToSDeg(headingRad);
	await speak(["rads ", roundVal(headingRad), ", degs ", roundVal(headingDeg)].join(""), true);
	setTimeout(async function() {
		setupBlockageHandler(headingRad, 0, 0, speed);

		var continueFunc = async function() {
			stopRoll();
			clearInterval(intervalHandler);
			await blinkLights([255, 0, 0], 6, 0.05);

			await returnHome(origLocation);
			updateColor(3);
			exitProgram();
		};
		setTimeout(continueFunc, timeToMove * 1000);
		await roll(headingDeg, speed, timeToMove);
	}, 3000);
}
