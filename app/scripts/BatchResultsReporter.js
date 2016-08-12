var BatchResultsReporter =
(function() {
    'use strict';

    function reportMatch(match, results, iterations) {
        let msg = '';
        match.rankings.forEach(_ => {
            msg += _.name + ': ' + results.wins[_.name] + '  ';
        });
        msg += 'ties: ' + results.ties;
        console.log(msg);
        chrome.runtime.sendMessage({
            action: 'updateResultsWindow',
            results: {
                match: match,
                rollup: results,
                iterations: iterations
            }
        });
    }

    return new function() {
        let reporter = this;

        reporter.reportMatch = reportMatch;
    };
})();
