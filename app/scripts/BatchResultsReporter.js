var BatchResultsReporter =
(function() {
    'use strict';

    function reportMatch(results) {
        chrome.runtime.sendMessage({
            action: 'updateResultsWindow',
            results: results
        });
    }

    return new function() {
        let reporter = this;

        reporter.reportMatch = reportMatch;
    };
})();
