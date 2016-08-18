var BatchRunRecorder =
(function() {
    'use strict';

    function createNew() {
        return { defaultOrder: createSection() };
    }

    function createSection() {
        return {
            runs: [],
            wins: {},
            ties: 0
        };
    }

    function recordMatch(match, results) {
        let section = results.defaultOrder;

        if (match.isMatchSwapped) {
            if (typeof results.swappedOrder === 'undefined') {
                results.swappedOrder = createSection();
            }
            section = results.swappedOrder;
        }

        section.runs.push(match);

        let winners = [];
        match.matchResults.rankings.forEach(_ => {
            if (!section.wins.hasOwnProperty(_.name)) {
                section.wins[_.name] = 0;
            }
            if (_.rank == 1) winners.push(_.name);
        });

        if (winners.length === 1) {
            section.wins[winners[0]]++;
        } else {
            section.ties++;
        }

        return results;
    }
    
    return new function() {
        var recorder = this;

        recorder.createNew = createNew;
        recorder.recordMatch = recordMatch;
    };
})();
