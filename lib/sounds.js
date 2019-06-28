var collisionSounds = [
    'Cow',
    'Dog',
    'Horse',
    'Lion'
                      ];

var turnSounds = [
    'Cat',
    'Pig',
    'Duck'
                  ];

var stuckSounds = [
    'Bee',
    'Chicken',
    'Donkey'
                   ];

var unstuckSounds = [
    'BabyBird',
    'Frog'
                     ];

function pickOne(a) {
    return a[Math.floor(a.length * Math.random())];
}

function getRandomCollisionSound() {
    return pickOne(collisionSounds);
}

function getRandomTurnSound() {
    return pickOne(turnSounds);
}

function getRandomStuckSound() {
    return pickOne(stuckSounds);
}

function getRandomUnstuckSound() {
    return pickOne(stuckSounds);
}

// **************** End sounds.js ****************
