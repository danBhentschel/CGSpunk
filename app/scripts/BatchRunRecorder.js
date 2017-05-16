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
            matches: [],
            arenaRank: params.arenaRank
        };
    }

    function userNameForAgent(agent) {
        if (!!agent.pseudo) return agent.pseudo;
        return agent.codingamer.pseudo;
    }

    function recordMatch(results, match, scores, matchResults) {
        if (matchResults.gameName == 'Roche') {
            matchResults = checkForCode4LifeBounceError(matchResults, results.userName);
        }
        results.matches.push({ data: match, results: matchResults, scores: scores });

        return results;
    }

    function checkForCode4LifeBounceError(matchResults, name) {
        if (matchResults.crash) { return matchResults; }

        let bounces = [];
        let idx = matchResults.history.agents[0] == name ? 0 : 1;
        let data = matchResults.history.data;
        let lastDestination = '';
        for (let i = 0; i < data.length; i++) {
            let thisMove = data[i].stdout[idx];
            if (thisMove.startsWith('WAIT')) { continue; }
            if (thisMove.startsWith('GOTO')) {
                let destination = thisMove.split(' ')[1];
                if (!!lastDestination && destination != lastDestination) {
                    bounces.push((i+1)*2);
                }

                lastDestination = destination;
            } else {
                lastDestination = '';
            }
        }

        if (bounces.length > 0) {
            matchResults.crash = `Station bounce on turns: ${bounces.join(', ', bounces)}`;
        }

        return matchResults;
    }
    
    return new function() {
        var recorder = this;

        recorder.createNew = createNew;
        recorder.recordMatch = recordMatch;
    };
})();
