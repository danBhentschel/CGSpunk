var BatchRunRecorder =
(function() {
    'use strict';

    function createNew(params) {
        let results = { defaultOrder: createSection(), matchInfo: {} };
        if (params.swapEnabled)
            results.swappedOrder = createSection();
        return results;
    }

    function createSection() {
        return {
            runs: [],
            wins: {},
            ties: 0
        };
    }

    function recordMatch(match, results, params) {
        let section = results.defaultOrder;
        if (match.isMatchSwapped) section = results.swappedOrder;

        section.runs.push(match);

        let won = false;
        let winners = [];
        match.matchResults.rankings.forEach(_ => {
            if (!section.wins.hasOwnProperty(_.name)) {
                section.wins[_.name] = 0;
            }
            if (_.rank == 1) {
                winners.push(_.name);
                if (params.currentUserName == _.name) won = true;
            }
        });

        if (winners.length === 1) {
            section.wins[winners[0]]++;
            results.matchInfo.winner = winners[0];
            results.matchInfo.tie = false;
        } else if (won) {
            section.ties++;
            results.matchInfo.tie = true;
        }

        return results;
    }
    
    return new function() {
        var recorder = this;

        recorder.createNew = createNew;
        recorder.recordMatch = recordMatch;
    };
})();
