var pythagoreanEquation = require('math-js/geometry/pythagoreanEquation');

var touches = {};

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

        if(
            time > 500 ||
            distance > 5 ||
            (event.target.form && (
                event.target.tagName !== 'BUTTON' &&
                !(
                    event.target.tagName === 'INPUT' &&
                    event.target.type.toLowerCase() === 'button'
                )
            ))
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