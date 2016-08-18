var BatchResultsReporter =
(function() {
    'use strict';

    function reportMatch(match, results, params) {
        chrome.runtime.sendMessage({
            action: 'updateResultsWindow',
            results: {
                match: match,
                rollup: results,
                params: params
            }
        });
    }

    return new function() {
        let reporter = this;

        reporter.reportMatch = reportMatch;
    };
})();
