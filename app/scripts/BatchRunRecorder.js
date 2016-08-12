var BatchRunRecorder =
(function() {
    'use strict';

    function createNew() {
        return {
            matches: [],
            wins: {},
            ties: 0
        };
    }

    function recordMatch(match, results) {
        results.matches.push(match);
        let winners = [];
        match.rankings.forEach(_ => {
            if (!results.wins.hasOwnProperty(_.name)) {
                results.wins[_.name] = 0;
            }
            if (_.rank == 1) winners.push(_.name);
        });

        if (winners.length === 1) {
            results.wins[winners[0]]++;
        } else {
            results.ties++;
        }

        return results;
    }
    
    return new function() {
        var recorder = this;

        recorder.createNew = createNew;
        recorder.recordMatch = recordMatch;
    };
})();
