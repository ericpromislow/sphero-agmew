// include "spherolib.js"
// include "reflectors.js"
// include "sounds.js"

var settings = {
  initialHeading: 0, // sdeg
  initialSpeed: 80,
  mainRunTime: 15, // sec
  minLocationCheckSize: 3,
  maxLocationCheckSize: 10,
  maxTimeWithoutTurning: 1 * 1000, // msec
  isStuckDistance: 4,
  inStuckMode: false,
  detectorInterval: 500, // msec
  __END__ : null
};

var state = {
  locationHistory: [], // array of [x, y, timestamp]
  speed: settings.initialSpeed,
  currentDegHeading: 0,
  detectorInterval: null, // handle for the detectorInterval handler
  __END__ : null
};

async function resetHeading(sound, headingCalculatorFunc) {
    if (sound && sound in Sound.Animal) {
        await Sound.Animal[sound].play(false);
    } else {
        //await speak("No sound, got " + (sound || "nothing"));
    }
    var newHeadingDeg = headingCalculatorFunc(state.currentDegHeading);
    var locs = state.locationHistory;
	locs.splice(0, locs.length, getSCoordsWithTime());
    state.currentDegHeading = newHeadingDeg;
	setHeading(newHeadingDeg);
	setSpeed(state.speed);
}

async function collisionDetector() {
    if (!detectorMask.collision) {
        return;
    }
    resetHeading(getRandomCollisionSound(), (deg) => reflectBackWithRandomOffset(deg, 30));
}

async function noTurnDetector() {
    var locs = state.locationHistory;
    var targetTime = targetWithFudgeFactor(settings.maxTimeWithoutTurning, 0.1);
    if (locs[locs.length - 1].time - locs[0].time >= targetTime) {
        let whichAngle = Math.random() < 0.5 ? -120 : 120;
        resetHeading(getRandomTurnSound(), (deg) => turnWithRandomOffset(deg, whichAngle, 30));
    }
}

async function isStuck(callbacks) 
{
    var locs = state.locationHistory;
    var locsLen = locs.length;
    var numLocsToCheck = 3;
    var firstIdx = locsLen - numLocsToCheck - 1;
    if (firstIdx < 0) firstIdx = 0;
    var lastIdx = locsLen - 2;
    var recentDistances = [];
    for (var i = firstIdx; i <= lastIdx; i++) {
        let loc1 = locs[i];
        let loc2 = locs[i + 1];
        let dx = loc2.x - loc1.x;
        let dy = loc2.y - loc1.y;
		//await speak(['d', 'x', dx, 'd', 'y', dy].join(" "))
        recentDistances.push(Math.sqrt(dx * dx + dy + dy));
    }
    var recentAvgDist = recentDistances.reduce((acc, val) => acc + val) / recentDistances.length;
    var result = recentAvgDist < settings.isStuckDistance;
    //await speak("dist is " + roundVal(recentAvgDist));
    var cb = result ? callbacks.ifYes : call.ifNo;
    if (cb) {
        cb();
    }
}

async function stuckDetector() {
    isStuck({ ifYes: function() {
            settings.inStuckMode = true;
            resetHeading(getRandomStuckSound(), (deg) => turnWithRandomOffset(deg, 180, 30));
            }
        });
}

async function areWeUnstuck() {
    isStuck({ ifYes: function() {
    // We tried turning around when we first detected we're stuck. Now wiggle around
    resetHeading(getRandomUnstuckSound(), (deg) => turnWithRandomOffset(deg, 60, 30));
            }, ifNo: function() {
                settings.inStuckMode = false;
                return;
            }
        });
}

async function angledDetector() {
}

var detectorCount = -1;
var detectorMask = { noTurn: true, stuck: true, angled: false, collision: true };
var detectorLabels = ['noTurn', 'stuck', 'angled'];
var detectorFuncs = [noTurnDetector, stuckDetector, angledDetector];

async function detectorInterval() {
    var currLocation = getSCoordsWithTime();
    var locs = state.locationHistory;
    locs.push(currLocation);
    var numLocs = locs.length;
    if (numLocs < settings.minLocationCheckSize) {
        return;
    }
    if (numLocs > settings.maxLocationCheckSize) {
        locs.splice(0, numLocs - settings.maxLocationCheckSize);
    }
    detectorCount += 1;
    if (settings.inStuckMode) {
        areWeUnstuck();
    } else {
        let idx = detectorCount % detectorLabels.length;
        var label = detectorLabels[idx];
        if (detectorMask[label]) {
            detectorFuncs[idx]();
        } else {
            // await speak("nope"); //QQQ
        }
    }
}

async function returnHome() {
    let loc = getLocation();
    // shift into cartesian coords
    let y2 = loc.x;
    let x2 = loc.y;
    loc = state.origLocation;
    let y1 = loc.x;
    let x1 = loc.y;
    // await speak(["x 1", x1, "y 1", y1, "x 2", x2, "y 2", y2].join(", "));
	let dx = x2 - x1;
	let dy = y2 - y1;
	let newHeadingRad = calcHeadingInRads(dx, dy);
	//await speak("rads, " + roundVal(newHeadingRad));
	let newHeadingDeg = wRadToSDeg(newHeadingRad);
    state.currentDegHeading = newHeadingDeg;
    state.locationHistory.splice(0);
    let dist = Math.sqrt(dx * dx + dy * dy);
	//await speak("home is degrees " + roundVal(newHeadingDeg) + ", dist " + roundVal(dist));
    updateColor(4);
    await roll(newHeadingDeg, state.speed, (dist + 1) / state.speed);
    updateColor(5);
    await delay(1.0);
    exitProgram();
}

async function doEnding() {
    clearInterval(state.detectorIntervalHandle);
    detectorMask.collision = false;
    stopRoll();
    updateColor(3);
    await blinkLights([255, 0, 0], 6, 0.05);
    await returnHome(state.origLocation);
}

async function startProgram() {
    state.origLocation = getSCoordsWithTime();
    state.locationHistory = [state.origLocation];
    updateColor(0);
	registerEvent(EventType.onCollision, collisionDetector);
    state.detectorIntervalHandle = setInterval(detectorInterval, settings.detectorInterval);
    state.currentDegHeading = settings.initialHeading;
    state.speed = settings.initialSpeed;

    setTimeout(doEnding, settings.mainRunTime * 1000);
    await roll(state.currentDegHeading, state.speed, settings.mainRunTime);
}
