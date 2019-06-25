var radius = 40.0;
var speed = 40.0; // units/sec

var x = radius;
var y = 0.0;
var heading = 90 * radPerDegree; // pi/2

var pathLength = 120;

var totalTimeNeeded = pathLength / speed;

const pi = Math.PI;
const radPerDegree = pi/180.0;
const degreePerRad = 180.0 / pi;

var colors = [
    [230, 25, 75],
[60, 180, 75],
[245, 130, 49],
[70, 240, 240],
[240, 50, 230],
[188, 246, 12],
[250, 190, 190],
[0, 128, 128],
[230, 190, 255]
              ];

function roundVal(val) {
	var vals = "" + val;
	var parts = vals.split('.');
	if (parts.length == 1) {
		return vals;
	} else {
		return parts[0] + "." + parts[1].substr(0, 2);
	}
}

var origLocation;

async function returnHome() {
	var location = getLocation();
    x = location.x;
    y = location.y;
	var dx = x - origLocation.x;
	var dy = y - origLocation.y;
	newHeadingRad = Math.atan2(dy, dx);
	await speak("dx, dy, new heading in rad is " + roundVal(dx) + ", " + roundVal(dy) + ", " + roundVal(newHeadingRad), true);
	newHeadingDeg = newHeadingRad * degreePerRad;
    
    // Now work out if we need to backup
    // Also keep in mind that nspiro wants angles in 0..360
	if (newHeadingDeg >= 0) {
		if (dx >= 0) {
			// quadrant 1, go back
            newHeadingDeg += 180;
			// else: quadrant 3 is pointing back
		}
	} else {
		if (dx <= 0) {
			// quadrant 2: point back
			newHeadingDeg += 540;
		} else {
			// quadrant 4: leave, but make it 0-based
			newHeadingDeg += 360;
		}
	}
	await speak("new heading in degrees is " + Math.round(newHeadingDeg), true);
	var distance = Math.sqrt(dx * dx + dy * dy);
	//registerEvent(EventType.onCollision, function() { exitProgram(); });
	updateColor(4);
	await speak("almost done", true);
	await roll(newHeadingDeg, speed, distance / speed);
	updateColor(5);
	
}

async function startProgram() {
	origLocation = getLocation();
	origLocation = { x: origLocation.x, y: origLocation.y };
    updateColor(0);
    headingDeg = headingRad = 0;
    await roll(headingDeg, speed, 4);
    stopRoll();
	await blinkLights([255, 0, 0], 6, 0.05);
    headingDeg += 90;
    await roll(headingDeg, speed, 2);
	stopRoll();
	await blinkLights([0, 255, 0], 12, 0.05);
	await returnHome();
	await blinkLights([0, 0, 255], 18, 0.05);
	updateColor(3);
	exitProgram();
}
