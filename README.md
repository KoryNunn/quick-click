quick-click
===========

## What

Makes bad mobile browsers (iOS safari) click quickly

## How

quick-click tracks touches, and detects if the time between a touchstart and touch end is less than 500ms, and the distance is less than 5px, and if so, triggers a click event.

## Usage

    var quickClick = require('quick-click');

    // Turn it on
    quickClick.init();

    // Turn it off
    quickClick.destroy();