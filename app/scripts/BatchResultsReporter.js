var BatchResultsReporter =
(function() {
    'use strict';

    function reportMatch(match, results, params) {
        chrome.runtime.sendMessage({
            action: 'updateResultsWindow',
            results: makeReport(match, results, params)
        });
    }

    function makeReport(match, results, params) {
        let report = {
            match: match,
            rollup: results,
            params: params
        };

        let swapEnabled = params.swapEnabled;
        let runNum = results.defaultOrder.runs.length;
        let factor = swapEnabled ? 2 : 1;
        let matchNum = runNum*factor;
        if (swapEnabled) matchNum -= runNum - results.swappedOrder.runs.length;
        let totalRuns = params.iterations;
        let totalMatches = totalRuns*factor;

        report.runNum = runNum;
        report.matchNum = matchNum;
        report.totalRuns = totalRuns;
        report.totalMatches = totalMatches;

        return report;
    }

    return new function() {
        let reporter = this;

        reporter.reportMatch = reportMatch;
    };
})();
