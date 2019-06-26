
var chai = require('chai');
var assert = chai.assert;

var fs = require('fs');
eval((fs.readFileSync('./lib/spherolib.js') + '').replace(/\bconst /g, ''));
eval((fs.readFileSync('./lib/reflectors.js') + '').replace(/\bconst /g, ''));

// test all four quadrants

var headingPairs = [[45, 225], [120, 300], [220, 40], [300, 120]];
var maxOffset = 10;
var numRuns = 1000;
headingPairs.forEach(function(pair) {
        let numBelow = 0;
        let [headingDeg, expectedDeg] = pair;
        for (var i = 0; i < numRuns; i++) {
            var newHeading = reflectBackWithRandomOffset(headingDeg, maxOffset);
            if (newHeading < expectedDeg) {
                numBelow += 1;
                assert.isAtLeast(newHeading, expectedDeg - maxOffset);
                assert.isAtMost(newHeading, expectedDeg);
            } else {
                assert.isAtLeast(newHeading, expectedDeg);
                assert.isAtMost(newHeading, expectedDeg + maxOffset);
            }
        }
// Assume our random number generator isn't too biased
        assert.isAtLeast(numBelow, numRuns * 0.4);
        assert.isAtMost(numBelow, numRuns * 0.6);
    });

var turnAmount = 90;
headingPairs = [[45, 135], [120, 210], [220, 310], [300, 30]];
var maxOffset = 20;
headingPairs.forEach(function(pair) {
        let numBelow = 0;
        let [headingDeg, expectedDeg] = pair;
        for (var i = 0; i < numRuns; i++) {
            var newHeading = turnWithRandomOffset(headingDeg, turnAmount, maxOffset);
            if (newHeading < expectedDeg) {
                numBelow += 1;
                assert.isAtLeast(newHeading, expectedDeg - maxOffset);
                assert.isAtMost(newHeading, expectedDeg);
            } else {
                assert.isAtLeast(newHeading, expectedDeg);
                assert.isAtMost(newHeading, expectedDeg + maxOffset);
            }
        }
// Assume our random number generator isn't too biased
        assert.isAtLeast(numBelow, numRuns * 0.4);
        assert.isAtMost(numBelow, numRuns * 0.6);
    });

var turnAmount = -75;
headingPairs = [[45, 330], [120, 45], [220, 145], [300, 225]];
var maxOffset = 20;
headingPairs.forEach(function(pair) {
        let numBelow = 0;
        let [headingDeg, expectedDeg] = pair;
        for (var i = 0; i < numRuns; i++) {
            var newHeading = turnWithRandomOffset(headingDeg, turnAmount, maxOffset);
            if (newHeading < expectedDeg) {
                numBelow += 1;
                assert.isAtLeast(newHeading, expectedDeg - maxOffset);
                assert.isAtMost(newHeading, expectedDeg);
            } else {
                assert.isAtLeast(newHeading, expectedDeg);
                assert.isAtMost(newHeading, expectedDeg + maxOffset);
            }
        }
// Assume our random number generator isn't too biased
        assert.isAtLeast(numBelow, numRuns * 0.4);
        assert.isAtMost(numBelow, numRuns * 0.6);
    });
