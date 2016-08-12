var BatchRunOptions =
(function() {
    'use strict';

    function getRunParameters() {
        return new Promise(resolve => {
            chrome.runtime.sendMessage({ action: 'getBatchRunOptions' }, options => resolve(options));
        });
    }

    return new function() {
        let options = this;

        options.getRunParameters = getRunParameters;
    };
})();
