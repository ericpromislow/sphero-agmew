# Day 2 Results

## Use spin to make an arc

Writing circles the hard way, repeatedly adjusting the heading after each segment, isn't the Sphero way. This might work for a very large circle at a decent speed, but in a smaller room the Sphero will just tie out. Better to use the builtin `spin` command. With a negative degree value to go clockwise; remember Sphero uses a `(y, x)` coordinate system so kids can work in their own coordinate system.

## Locking the gyroscope

At some point Spiro locked its orientation in an inconvenient way (tough enough having to always mentally convert between its `(y, x)` universe and the `(x, y)` one I'm used to). Solution: use the iPhone App to turn Spiro off completely. Go outside for a walk in the glorious sunshine only to discover that wildfire season is upon us once again. Come back, re-engage Spiro, and the gyroscope works again.

### Main annoyance
It takes a long time to recharge a fully drained SPRK. And the fully charged battery doesn't last very long either. Tough to do trial-and-error work.

## Today's Accomplishments

* Wrote a library, spherolib, for dealing with the coordinate system transformations, as well as calculating reflections and steering with random perturbations.

* Wrote a test for the above library, with a trivial `Makefile` to drive it.

* Got collisions working

* Got steering in a +/- 60-degree range when running for 3 seconds working

* Wrote a detector for getting stuck, but it needs work

* Wrote a detector for when Spiro is running along a wall, but haven't incorporated it yet

* Emit animal sounds when Spiro has a major event
