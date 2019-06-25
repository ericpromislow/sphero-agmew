function BlockageHandler(headingRad, x, y, speed) {
    this.headingRad = headingRad;
    this.startingX = x;
    this.startingY = y;
    this.speed = speed;
}

BlockageHandler.prototype = {
  checkHeading: function() {
        var loc = getWCoords();
        var x = loc.x, y = loc.y;
        var dx = x - this.startingX;
        var dy = y - this.startingY;
        var currentHeadingRad = calcHeadingInRads(dx, dy);
        // Adjust currentHeadingRad if it and this.headingRad are straddling the positive 0 axis
        if (currentHeadingRad <= pihalfup &&
            this.headingRad >= pihalfdown) {
            currentHeadingRad -= pi2;
        } else if (currentHeadingRad >= pihalfdown && this.headingRad <= pihalfup) {
            currentHeadingRad -= pi2;
        }
        var headingDiff = currentHeadingRad - this.headingRad;
        if (Math.abs(headingDiff) <= 0.1) {
            return;
        }
        var newHeadingRad;
        if (headingDiff < 0) {
            // angle is smaller
            newHeadingRad = currentHeadingRad - (pi / 12) * Math.random();
        } else {
            newHeadingRad = currentHeadingRad + (pi / 12) * Math.random();
        }
        setHeading(wRadToSDeg(newHeadingRad));
        this.headingRad = newHeadingRad;
        this.startingX = x;
        this.startingY = y;
    },
  
  __END__: null
}
    
// **************** End blockage-handler.js ****************
