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
    if (event.target.fireEvent) {
        return;
    }

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

        //var virtualEvent = new MouseEvent('click');
        var virtualEvent = document.createEvent( 'HTMLEvents' )

        virtualEvent.initEvent('click', true, true, window,
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
        virtualEvent._quickClick = true;

        var focusedElement = document.querySelector(':focus');
        focusedElement && focusedElement.blur();
        event.target.dispatchEvent(virtualEvent);
    }
}

var badClick;
function clickHandler(event){
    if(badClick && !event._quickClick){
        badClick = false;
        event.preventDefault();
        event.stopPropagation();
        return;
    }

    badClick = event._quickClick;

    setTimeout(function(){
        badClick = false;
    },500);
}

module.exports = {
    init: function clickQuick(){
        touches = {};
        window.addEventListener('touchstart', startHandler, true);
        window.addEventListener('touchend', endHandler, true);
        window.addEventListener('click', clickHandler, true);
    },
    destroy:function(){
        window.removeEventListener('touchstart', startHandler, true);
        window.removeEventListener('touchend', endHandler, true);
        window.removeEventListener('click', clickHandler, true);
    }
};