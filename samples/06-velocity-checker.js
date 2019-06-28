// include "spherolib.js"
// include "reflectors.js"
// include "sounds.js"

var settings = {
  interval: 1000, // msec
  __END__ : null
};

async function reactToVelocity() {
    vel = getVelocity();
    var x1 = Math.abs(vel.x);
    var x2 = 5 * x1 * x1 * x1;
    var y1 = Math.abs(vel.y);
    var y2 = 5 * y1 * y1 * y1;
    setMainLed({ r: Math.floor(x2) % 256,
                g: Math.floor(y2) % 256,
                b: 0});
}

async function startProgram() {
    setInterval(reactToVelocity, settings.interval);
}
