// To run this: 

var chai = require('chai');
var assert = chai.assert;

var fs = require('fs');
eval((fs.readFileSync('./lib/spherolib.js') + '').replace(/\bconst /g, ''));

// test coordinates

assert.approximately(wRadToSDeg(0), 90, 0.1);
assert.approximately(wRadToSDeg((1 * pi) / 4), 45, 0.1);
assert.approximately(wRadToSDeg(pihalfup), 0, 0.1);
assert.approximately(wRadToSDeg((3 * pi) / 4), 315, 0.1);
assert.approximately(wRadToSDeg(pi), 270, 0.1);
assert.approximately(wRadToSDeg((5 * pi) / 4), 225, 0.1);
assert.approximately(wRadToSDeg(pihalfdown), 180, 0.1);
assert.approximately(wRadToSDeg((7 * pi) / 4), 135, 0.1);
assert.approximately(wRadToSDeg(pi2), 90, 0.1);

assert.approximately(wRadToSDeg((4 * pi) + (1 * pi) / 4), 45, 0.1);
assert.approximately(wRadToSDeg(- (4 * pi) + (1 * pi) / 4), 45, 0.1);

assert.approximately(sDegToWRad(0), pihalfup, 0.1);
assert.approximately(sDegToWRad(45), (1 * pi) / 4, 0.1);
assert.approximately(sDegToWRad(90), 0, 0.1);
assert.approximately(sDegToWRad(135), (7 * pi) / 4, 0.1);
assert.approximately(sDegToWRad(180), pihalfdown, 0.1);
assert.approximately(sDegToWRad(225), (5 * pi) / 4, 0.1);
assert.approximately(sDegToWRad(270), pi, 0.1);
assert.approximately(sDegToWRad(315), (3 * pi) / 4, 0.1);
assert.approximately(sDegToWRad(360), pihalfup, 0.1);
assert.approximately(sDegToWRad(405), (1 * pi) / 4, 0.1);

assert.approximately(wRadToSDeg(calcHeadingInRads(4, 3)), 53.13, 0.1)
assert.approximately(wRadToSDeg(calcHeadingInRads(300, 200)), 56.31, 0.1)
assert.approximately(wRadToSDeg(calcHeadingInRads(-300, 200)), 303.69, 0.1)

x = [];
var currHeading = (2 * pi) / 3;
var offset = pi / 12;
for (var i = 0; i < 30; i++) {
    let newHeading = steerAtRandomRadHeading(currHeading, offset, offset);
    if (newHeading > currHeading) {
        assert.isAtMost(newHeading, currHeading + 2 * offset);
        assert.isAtLeast(newHeading, currHeading + 1 * offset);
    } else {
        assert.isAtMost(newHeading, currHeading - 1 * offset);
        assert.isAtLeast(newHeading, currHeading - 2 * offset);
    }
}
