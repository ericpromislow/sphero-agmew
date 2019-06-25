### A note on notation

"Sphero" is the name of the company that makes various robotic toys, including the SPRK+ I'm using in this project. "Spiro" is the name of the particular SPRK+ I'm using in this project.

# Day 1 Results

## Debugging

Today I wanted to at least move Spiro through a circle. I got it to draw the first part of the circle (going counter-clockwise, which should have been a loud clue), but the second part of the circle formed the top part of an "S". And then when I tried to get Spiro to come home, it would take off heading "east", instead of back "south" to home base.

Meanwhile I really wanted to debug the thing.  When I rewrote my Spiro programs as standalone Node.js programs, simulating the movement by using basic kinetics, the calculations made sense. But even trying to run simple subsets led to bizarre notations.

Then I had inspiration #1. There's no `alert` in the sphero JS bindings. There's no `console.log`, although using it doesn't give an error message. It seems to  be ignored. Maybe it's used internally for debugging purposes, but it wasn't completely disabled in production.

But there is a `speak`. I've never had a program read my `printf` statements aloud to me. But it's indeed cool. Just be sure to round your floats down to a reasonable precision, or you'll be spending all your time listening to the Sphero driver prove it knows its numbers.

## Why the 'S'

At the end of the day I reread more of the Sphero docs (which are kind of fragmented), and discovered that for whatever reason, the SPRK+ uses its own coordinate system. It's been a long time since I've used the equations of rotation that I learned way back in physics class, but now I get to. The conversion from world-space to Spiro-space involves a reflection over the y-axis and then a rotation by _-\pi / 2_. 

So I'm hoping that for day 2 I'll have a small library of conversion functions, and then everything I expect to work in standard 2-D space will with Spiro.
