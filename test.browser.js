(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var pythagoreanEquation = require('math-js/geometry/pythagoreanEquation');

var touches = {},
    ignoreTags = ['INPUT', 'SELECT','TEXTAREA'];

function startHandler(event){
    for(var i = 0; i < event.changedTouches.length; i++){
        touches[event.changedTouches[i].identifier] = {
            x: event.changedTouches[i].pageX,
            y: event.changedTouches[i].pageY,
            time: Date.now()
        };
    }
}

function endHandler(event){
    for(var i = 0; i < event.changedTouches.length; i++){
        var touch = event.changedTouches[i],
            startInfo = touches[touch.identifier],
            startPosition = touches[event.changedTouches[i].identifier],
            time,
            distance;

        if(!startInfo){
            return;
        }

        time = Date.now() - startInfo.time,
        distance = pythagoreanEquation(
            startPosition.x - touch.pageX,
            startPosition.y - touch.pageY
        );

        var targetTagName = event.target.tagName;

        if(
            time > 500 ||
            distance > 5 ||
            (
                ignoreTags.indexOf(targetTagName) >= 0 &&
                event.target.type.toLowerCase() !== 'button'
            )
        ){
            return;
        }

        event.preventDefault();

        var virtualEvent = new MouseEvent('click');

        virtualEvent.initMouseEvent('click', true, true, window,
           event.detail,
           touch.screenX,
           touch.screenY,
           touch.clientX,
           touch.clientY,
           event.ctrlKey,
           event.altKey,
           event.shiftKey,
           event.metaKey,
           touch.target,
           touch.relatedTarget
        );

        var focusedElement = document.querySelector(':focus');
        focusedElement && focusedElement.blur();
        event.target.dispatchEvent(virtualEvent);
    }
}

module.exports = {
    init: function clickQuick(){
        touches = {};
        window.addEventListener('touchstart', startHandler);
        window.addEventListener('touchend', endHandler);
    },
    destroy:function(){
        window.removeEventListener('touchstart', startHandler);
        window.removeEventListener('touchend', endHandler);
    }
};
},{"math-js/geometry/pythagoreanEquation":2}],2:[function(require,module,exports){
module.exports = function(sideA, sideB){
    return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}
},{}],3:[function(require,module,exports){
window.quickClick = require('./');
},{"./":1}]},{},[3])