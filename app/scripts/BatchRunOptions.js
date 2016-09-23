var BatchRunOptions =
(function(dom) {
    'use strict';

    function getRunParameters() {
        return dom.getNumPlayerSlots()
            .then(getBatchRunOptions);
    }

    function getBatchRunOptions(numPlayerSlots) {
        return new Promise(resolve =>
            chrome.runtime.sendMessage({
                action: 'getBatchRunOptions',
                numPlayerSlots: numPlayerSlots
            }, options => resolve(options)));
    }

    return new function() {
        let options = this;

        options.getRunParameters = getRunParameters;
    };
})(IdeDomManipulator);
