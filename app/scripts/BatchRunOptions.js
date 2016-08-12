var BatchRunOptions =
(function() {
    'use strict';

    function getRunParameters() {
        return {
            iterations: 3
        };
    }

    return new function() {
        let options = this;

        options.getRunParameters = getRunParameters;
    };
})();
