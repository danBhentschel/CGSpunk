var BatchResultsReporter =
(function() {
    'use strict';

    function reportMatch(match, results) {
        let msg = '';
        match.rankings.forEach(_ => {
            msg += _.name + ': ' + results.wins[_.name] + '  ';
        });
        msg += 'ties: ' + results.ties;
        console.log(msg);
    }

    return new function() {
        let reporter = this;

        reporter.reportMatch = reportMatch;
    };
})();
