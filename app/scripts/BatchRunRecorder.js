var BatchRunRecorder =
(function() {
    'use strict';

    function createNew(params) {
        return {
            totalMatches: params.matches.length,
            batchNum: params.batchNum,
            instanceNum: params.instanceNum,
            matches: []
        };
    }

    function recordMatch(results, match, matchResults) {
        results.matches.push({ data: match, results: matchResults });

        return results;
    }
    
    return new function() {
        var recorder = this;

        recorder.createNew = createNew;
        recorder.recordMatch = recordMatch;
    };
})();
