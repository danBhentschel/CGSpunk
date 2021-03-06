var BatchRunner =
(function(dom, recorder, reporter) {

    var g_instanceNum = Math.floor(Math.random()*999999 + 1);
    var g_batchNum = 0;

    function runBatch(params, ideActions) {
        dom.toggleBatchButtons();
        chrome.runtime.sendMessage({action:'showResultsWindow', instanceNum: g_instanceNum});

        params.instanceNum = g_instanceNum;
        params.batchNum = g_batchNum;
        g_batchNum++;

        let context = {
            params: params,
            ideActions: ideActions,
            results: recorder.createNew(params),
            matchNum: 0,
            matches: params.matches,
            stop: false
        };

        doMatch(context);

        return context;
    }

    function doMatch(context) {
        setupMatch(context)
            .then(context.ideActions.playMatch)
            .then(context.ideActions.stopPlayback)
            .then(context.ideActions.getResultsOfMatch)
            .then(results => {
                if (!!results.crash) return results;
                return context.ideActions.getGameEndState()
                    .then(endState => {
                        results.endState = endState;
                        return results;
                    });
            })
            .then(results => {
                context.ideActions.getGameScores()
                    .then(scores => {
                        let match = context.matches[context.matchNum];
                        match.gameOptions = results.options;
                        context.results = recorder.recordMatch(context.results, match, scores, results);
                        reporter.reportMatch(context.results);
                        context.matchNum++;
                        nextMatch(context);
                    });
            });
    }

    function nextMatch(context) {
        if (context.matchNum > context.matches.length-1 || context.stop) {
            reporter.batchStopped(context.results);
            dom.buttonStop();
            dom.toggleBatchButtons();
            context.ideActions.addAgents(context.params.initialAgents);
            return;
        }

        setTimeout(() => doMatch(context), context.params.pauseBetweenMatches * 1000);
    }

    function setupMatch(context) {
        let match = context.matches[context.matchNum];
        let setGameOptions = match.gameOptions === '**auto'
            ? context.ideActions.setGameOptionsToAuto
            : (match.gameOptions === '**manual'
                ? context.ideActions.setGameOptionsToManual
                : () => context.ideActions.setGameOptionsText(match.gameOptions));

        return context.ideActions.addAgents(match.agents)
            .then(setGameOptions);
    }

    function stopBatch(context) {
        dom.buttonStopping();
        reporter.batchStopping(g_instanceNum);
        context.stop = true;
    }

    function stopBatchForInstance(instanceNum, context) {
        if (instanceNum === g_instanceNum) {
            stopBatch(context);
        }
    }

    return new function() {
        let runner = this;

        runner.runBatch = runBatch;
        runner.stopBatch = stopBatch;
        runner.stopBatchForInstance = stopBatchForInstance;
    };
})(IdeDomManipulator, BatchRunRecorder, BatchResultsReporter);
