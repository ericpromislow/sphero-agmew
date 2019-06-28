# Day 3: Calling it done (for now?)

## Rewrote the program to go with Sphero's `(y, x)` coordinates and degrees rather than a more "mathematical" radians-based system. The only place where I needed to use the conventional units and plane was when calculating the path to go from the current point to a target point.

## Fabricating events

* Write a bunch of small handlers
* Use a general dispatcher that fires every *n* msec
  Use a mask to enable/disable which handlers to fire at any point
  Round-robin through all the handlers, fire only if the selected one is enabled

## Handlers:

* General collision detector (built-in)
* Time to turn
* Stuck
* Not traveling at the desired angle (traveling along a wall)

I didn't implement the angled handler because it turns out I needed to move the ball faster to get more consistent sets of speeds and angles. At low speeds there's too much noise. And that's when I did some research in SpheroTwitter and saw that the ball is designed to be used in school gymnasiums.

## Development IDE:

The Sphero SPRK code environment has no file system. And the runtime engine has no console or windowing system to display runtime diagnostics. It does emit sounds, and I was using `speak(message)` to debug some issues. But that's no way to code.

I wrote a few small libraries with a collection of functions and global constants that the code could use. Then I wrote tests for most of the functions, using node's `chai` library for its basic `assert` statements.

The last issue to solve was how to transfer code from my desktop system to the Sphero IDE. I ended up writing a 2-line build script:

```
BFILE=$1

cat $(grep '^// include ' $BFILE |
      awk ' { print $3 }' |
      sed 's@"\(.*\)"@./lib/\1@g') $BFILE |
    pbcopy
```

I used directives like 
```
// include 'lib/spherolib.js'
```

to show what I wanted to include, conceptually. The `build` script implemented that intention.
I could then clear the IDE's editor script and paste the new code in.

## Cat score:

Amused: 2 / 5
Enthralled: 3 / 5 (only when it was off and stationary)
Enraged: 0 / 5

On the other hand, the cat liked to grab the ball with his feet when it was turned off, making it a very expensive generic cat toy.
