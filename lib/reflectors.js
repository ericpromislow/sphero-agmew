function reflectBackWithRandomOffset(headingDeg, maxOffset) {
    return normalizeDegrees(180 + headingDeg + (maxOffset - (2 * maxOffset) * Math.random()));
}

function turnWithRandomOffset(headingDeg, amountToTurn, maxOffset) {
    return normalizeDegrees(headingDeg + amountToTurn + (maxOffset - (2 * maxOffset) * Math.random()));
}

// **************** End reflectors.js ****************
