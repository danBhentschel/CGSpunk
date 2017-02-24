var BatchResultsReporter =
(function() {
    'use strict';

    function reportMatch(results) {
        chrome.runtime.sendMessage({
            action: 'updateResultsWindow',
            results: results
        });
    }

    function batchStopped(results) {
        chrome.runtime.sendMessage({
            action: 'batchStopped',
            results: results
        });
    }

    function batchStopping(instanceNum) {
        chrome.runtime.sendMessage({
            action: 'batchStopping',
            instanceNum: instanceNum
        });
    }

    return new function() {
        let reporter = this;

        reporter.reportMatch = reportMatch;
        reporter.batchStopped = batchStopped;
        reporter.batchStopping = batchStopping;
    };
})();
