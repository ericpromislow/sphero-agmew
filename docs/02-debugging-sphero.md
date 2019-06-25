# How to debug your Sphero JavaScript code.

## The bad news

### Alert doesn't work

### `console.log` statements are ignored. 

You can use the `Sensor Data` tab in the IDE to view many metrics during a program run.

## A longer answer.

I code up the algorithms involving heading calculation, etc., in a
standalone JavaScript program I can run with `node.js`. This way I can use print statements or debug in an environment like *ActiveState Komodo* or *Visual Studio Code* to verify my calculations.

## Some good news

I've never debugged code by getting the computer to talk to me, but `speak(statement, true)` is working ok.  Remember to round off your floating point numbers
