
const pi = Math.PI;
const pi2 = 2 * Math.PI;
const pihalfup = pi / 2;
const pihalfdown = pi * 1.5;
const radPerDegree = pi/180.0;
const degreePerRad = 180.0 / pi;

function w2SCoords(x, y) {
    return { x:y, y:x };
}

function sLoc2wCoords(loc) {
    return { x:loc.y, y:loc.x };
}

function getWCoords() {
    return sLoc2wCoords(getLocation());
}

function getSCoordsWithTime() {
    var loc = getLocation();
    loc.time = timestamp();
    return loc;
}

function getWCoordsWithTime() {
    var loc = getWCoords();
    loc.time = timestamp();
    return loc;
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
    degrees = (degrees % 360);
    if (degrees < 0) {
        degrees += 360;
    }
    return degrees;
}

function wRadToSDeg(rads) {
    return normalizeDegrees(450 - normalizeRads(rads) * degreePerRad);
}

function sDegToWRad(degs) {
    return normalizeDegrees(450 - degs) * radPerDegree;
}

function dirtyReflectRadHeading(headingRad) {
    var perturbation = (pi / 12) - (pi / 6) * Math.random();
    return normalizeRads(headingRad + pi + perturbation);
}

function steerAtRandomRadHeading(headingRad, radOffset, radSegment) {
    var perturbation = radSegment - (2 * radSegment * Math.random());
    if (perturbation >= 0) {
        return headingRad + perturbation + radOffset;
    } else {
        return headingRad + perturbation - radOffset;
    }
}

// helpers

function roundVal(val) {
	return Math.round(val * 100) / 100.0;
}

function timestamp() {
    return (new Date()).valueOf();
}

// colors

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

async function blinkLights(colorEntry, numBlinks, delayTime) {
    await strobe({r: colorEntry[0], g: colorEntry[1], b: colorEntry[2]}, delayTime, numBlinks);
}

function updateColor(index) {
    var colorEntry = colors[index % colors.length];
    setMainLed({ r: colorEntry[0], g: colorEntry[1], b: colorEntry[2]});
}

// **************** End spherolib.js ****************
