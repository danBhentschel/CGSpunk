var DomUtils =
(function() {
    'use strict';

    function pressEnter(element) {
        pressKey(13, element);
    }
    
    function pressKey(k, element) {
        var oEvent = document.createEvent('KeyboardEvent');

        // Chromium Hack
        Object.defineProperty(oEvent, 'keyCode', {
            get : function() {
                return this.keyCodeVal;
            }
        });
        Object.defineProperty(oEvent, 'which', {
            get : function() {
                return this.keyCodeVal;
            }
        });

        if (oEvent.initKeyboardEvent) {
            oEvent.initKeyboardEvent('keydown', true, true, document.defaultView, false, false, false, false, k, k);
        } else {
            oEvent.initKeyEvent('keydown', true, true, document.defaultView, false, false, false, false, k, 0);
        }

        oEvent.keyCodeVal = k;

        element.dispatchEvent(oEvent);
    }

    return new function() {
        let utils = this;

        utils.pressEnter = pressEnter;
    };
})();
