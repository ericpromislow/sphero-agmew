var locationHistory;
var locationHistoryMinCheckSize = 3;
var locationHistoryMaxCheckSize = 10;
var speed = 100;

var directionInterval = 0;

var currentRadHeading;

async function handleCollision(msg) {
    if (!msg) {
        msg = "bang";
    }
	await speak(msg);
    currentRadHeading = dirtyReflectRadHeading(currentRadHeading);
    var newHeadingDeg = wRadToSDeg(currentRadHeading);
	locationHistory.splice(0, locationHistory.length, getWCoordsWithTime());
	setHeading(newHeadingDeg);
	setSpeed(speed);
	// setupBlockageHandler(newHeadingRad, loc.x, loc.y, speed);
}

async function changeDirectionIfNeeded() {
    var currLocation = getWCoordsWithTime();
    locationHistory.push(currLocation);
    var numLocs = locationHistory.length;
    if (numLocs < locationHistoryMinCheckSize) {
        return false;
    }
    if (numLocs > locationHistoryMaxCheckSize) {
        locationHistory.splice(0, numLocs - locationHistoryMaxCheckSize);
    }
	for (var i = 0; i < numLocs; i++) {
		var val = locationHistory[i];
		//await speak(["x", roundVal(val.x), "y", roundVal(val.y), "time", Math.round((val.time / 1000)) % 100 ].join(", "));
	}
    var latestSpeeds = locationHistory.map(function(val, index) {
            if (index == 0) {
                return null;
            } else {
                var prevVal = locationHistory[index - 1]
                var dx = val.x - prevVal.x;
                var dy = val.y - prevVal.y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                var timeDiff = prevVal.time - val.time;
                if (timeDiff <= 0.0001) {
                    return null;
                }
                return dist / timeDiff;
            }
        }).filter(speed2 => speed2 !== null);
    var avgSpeed = latestSpeeds.reduce((acc, val) => acc + val) / latestSpeeds.length;
    await speak("v speed " + roundVal(avgSpeed));
    if (avgSpeed < (speed / 10)) {
        setTimeout(handleCollision, 1, "stuck");
    }
}

async function startProgram() {
	var origLocation = getWCoordsWithTime();
    var targetX = -300;
    var targetY = 200;
    locationHistory = [origLocation];
    updateColor(0);
    var distance = Math.sqrt(targetX * targetX + targetY * targetY);
	registerEvent(EventType.onCollision, handleCollision);
    setSpeed(speed);
    var timeToMove = 120;
    var headingRad = calcHeadingInRads(targetX, targetY);
    currentRadHeading = headingRad;
    var headingDeg = wRadToSDeg(headingRad);
	// await speak(["rads ", roundVal(headingRad), ", degs ", roundVal(headingDeg)].join(""), true);
	setTimeout(async function() {
		var continueFunc = async function() {
			stopRoll();
			await blinkLights([255, 0, 0], 6, 0.05);

			await returnHome(origLocation);
			updateColor(3);
			exitProgram();
		};
		setTimeout(continueFunc, timeToMove * 1000);
        directionInterval = setInterval(changeDirectionIfNeeded, 2000);
		await roll(headingDeg, speed, timeToMove);
	}, 1);
}
