
var chai = require('chai');
var assert = chai.assert;

var fs = require('fs');
eval((fs.readFileSync('./lib/sounds.js') + '').replace(/\bconst /g, ''));

var labels = [
    'Cow',
    'Dog',
    'Horse',
    'Lion'
              ];
var counts = {};
labels.forEach((x) => counts[x] = 0);
var numRuns = 1000;
for (var i = 0; i < numRuns; i++) {
    counts[getRandomCollisionSound()] += 1;
}
labels.forEach(function(label) {
        let count = counts[label];
        assert.isAtLeast(count, numRuns * 0.1);
        assert.isAtMost(count, numRuns * 0.4);
    });

