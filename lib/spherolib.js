
const pi = Math.PI;
const pi2 = 2 * Math.PI;
const radPerDegree = pi/180.0;
const degreePerRad = 180.0 / pi;

function w2SCoords(x, y) {
    return { x:y, y:x };
}

function sLoc2wCoords(loc) {
    return { x:loc.y, y:loc.x };
}

function calcHeadingInRads(dx, dy) {
    return normalizeRads(Math.atan2(dy, dx));
}

function normalizeRads(rads) {
    while (rads < 0) {
        rads += pi2;
    }
    while (rads >= pi2) {
        rads -= pi2;
    }
    return rads;
}

function normalizeDegrees(degrees) {
    while (degrees >= 360) {
        degrees -= 360;
    }
    return degrees;
}

function wRadToSDeg(rads) {
    return normalizeDegrees(450 - normalizeRads(rads) * degreePerRad);
}

function sDegToWRad(degs) {
    return normalizeDegrees(450 - degs) * radPerDegree;
}

// sphero-specific

async function blinkLights(colorEntry, numBlinks, delayTime) {
    await strobe({r: colorEntry[0], g: colorEntry[1], b: colorEntry[2]}, delayTime, numBlinks);
}

// helpers

function roundVal(val) {
	return Math.round(val * 100) / 100.0;
}
