var BatchRunRecorder =
(function() {
    'use strict';

    function createNew(params) {
        return {
            totalMatches: params.matches.length,
            userName: userNameForAgent(params.matches[0].agents[0]),
            batchNum: params.batchNum,
            instanceNum: params.instanceNum,
            swapEnabled: params.swapEnabled,
            arenaCodeEnabled: params.arenaCodeEnabled,
            numOpponents: params.numOpponents,
            matches: []
        };
    }

    function userNameForAgent(agent) {
        if (!!agent.pseudo) return agent.pseudo;
        return agent.codingamer.pseudo;
    }

    function recordMatch(results, match, scores, matchResults) {
        results.matches.push({ data: match, results: matchResults, scores: scores });

        return results;
    }
    
    return new function() {
        var recorder = this;

        recorder.createNew = createNew;
        recorder.recordMatch = recordMatch;
    };
})();
