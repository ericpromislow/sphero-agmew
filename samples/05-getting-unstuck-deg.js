// include "spherolib.js"
// include "reflectors.js"
// include "sounds.js"

var settings = {
  initialHeading: 0, // sdeg
  initialSpeed: 80,
  mainRunTime: 15 * 1000, // msec
  minLocationCheckSize: 3,
  maxLocationCheckSize: 10,
  maxTimeWithoutTurning: 1 * 1000, // msec
  isStuckDistance: 1,
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
    if (locs[locs.length - 1].time - locs[0].time >= settings.maxTimeWithoutTurning) {
        let whichAngle = Math.random() < 0.5 ? -90 : 90;
        resetHeading(getRandomTurnSound(), (deg) => turnWithRandomOffset(deg, whichAngle, 30));
    }
}

async function stuckDetector() {
    var locs = state.locationHistory;
    var locsLen = locs.length;
    var numLocsToCheck = 3;
    var firstIdx = locsLen - numLocsToCheck - 1;
    if (firstIdx < 0) firstIdx = 0;
    var lastIdx = locsLen - 2;
    var recentDistances = [];
    for (var i = firstIdx; i < lastIdx; i++) {
        let loc1 = locs[i];
        let loc2 = locs[i + 1];
        let dx = loc2.x - loc1.x;
        let dy = loc2.y - loc1.y;
        recentDistances.push(Math.sqrt(dx * dx + dy + dy));
    }
    var recentAvgDist = recentDistances.reduce((acc, val) => acc + val) / recentDistances.length;
    if (recentAvgDist < isStuckDistance) {
        resetHeading(getRandomStuckSound(), (deg) => turnWithRandomOffset(deg, 135, 45));
    }
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
    let idx = detectorCount % detectorLabels.length;
    var label = detectorLabels[idx];
    if (detectorMask[label]) {
        detectorFuncs[idx]();
    } else {
        // await speak("nope"); //QQQ
    }
}

async function returnHome() {
    let loc = getLocation();
    // shift into cartesian coords
    let y1 = loc.x;
    let x1 = loc.y;
    loc = state.locationHistory[0];
    let y2 = loc.x;
    let x2 = loc.y;
	let dx = x2 - x1;
	let dy = y2 - y1;
	let newHeadingRad = calcHeadingInRads(dx, dy);
	let newHeadingDeg = wRadToSDeg(newHeadingRad);
    state.currentDegHeading = newHeadingDeg;
    state.locationHistory.splice(0);
    let dist = Math.sqrt(dx * dx + dy * dy);
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

    setTimeout(doEnding, settings.mainRunTime);
    await roll(state.currentDegHeading, state.speed, settings.mainRunTime);
}
