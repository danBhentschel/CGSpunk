var BatchRunOptions =
(function(dom) {
    'use strict';

    function getRunParameters(inArena) {
        return dom.getNumPlayerSlots()
            .then(slots => getBatchRunOptions(slots, inArena));
    }

    function getBatchRunOptions(numPlayerSlots, inArena) {
        return new Promise(resolve =>
            chrome.runtime.sendMessage({
                action: 'getBatchRunOptions',
                numPlayerSlots: numPlayerSlots,
                inArena: inArena
            }, options => resolve(options)));
    }

    return new function() {
        let options = this;

        options.getRunParameters = getRunParameters;
    };
})(IdeDomManipulator);
