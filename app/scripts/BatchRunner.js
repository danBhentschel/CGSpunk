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
        if (context.matchNum > context.matches.length-1 || context.stop) {
            dom.toggleBatchButtons();
            context.ideActions.addAgents(context.params.initialAgents);
            return;
        }

        setupMatch(context)
            .then(context.ideActions.playMatch)
            .then(context.ideActions.stopPlayback)
            .then(dom.getResultsOfMatch)
            .then(results => {
                let match = context.matches[context.matchNum];
                match.gameOptions = results.options;
                context.results = recorder.recordMatch(context.results, match, results);
                reporter.reportMatch(context.results);
                context.matchNum++;
                doMatch(context);
            });
    }

    function setupMatch(context) {
        let match = context.matches[context.matchNum];
        let setGameOptions = match.gameOptions === '**auto'
            ? context.ideActions.setGameOptionsToAuto
            : context.ideActions.setGameOptionsToManual;

        return context.ideActions.addAgents(match.agents)
            .then(setGameOptions);
    }

    function stopBatch(context) {
        context.stop = true;
    }

    return new function() {
        let runner = this;

        runner.runBatch = runBatch;
        runner.stopBatch = stopBatch;
    };
})(IdeDomManipulator, BatchRunRecorder, BatchResultsReporter);
