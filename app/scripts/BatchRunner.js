var BatchRunner =
(function(dom, recorder, reporter) {

    var g_instanceNum = Math.floor(Math.random()*999999 + 1);
    var g_batchNum = 0;

    function runBatch(params, ideActions) {
        dom.toggleBatchButtons();
        chrome.runtime.sendMessage({action:'showResultsWindow', instanceNum: g_instanceNum});

        let context = {
            params: params,
            ideActions: ideActions,
            results: recorder.createNew(params),
            iteration: 1,
            swapped: false,
            stop: false
        };

        params.instanceNum = g_instanceNum;
        params.batchNum = g_batchNum;
        g_batchNum++;

        ideActions.getCurrentUser()
            .then(user => {
                params.currentUserName = user.pseudo;
                doIteration(context);
            });

        return context;
    }

    function doIteration(context) {
        if (context.iteration > context.params.iterations || context.stop) {
            dom.toggleBatchButtons();
            return;
        }

        selectNextOpponent(context)
            .then(context.ideActions.playMatch)
            .then(context.ideActions.stopPlayback)
            .then(dom.getResultsOfMatch)
            .then(results => addAgentsInfoToResults(context.ideActions, results))
            .then(results => {
                let match = prepareMatchResults(context, results);
                context.results = recorder.recordMatch(match, context.results, context.params);
                reporter.reportMatch(match, context.results, context.params);
                doNextIteration(context);
            });
    }

    function addAgentsInfoToResults(ideActions, results) {
        return ideActions.getAgentsData()
            .then(agents => {
                results.agents = agents;
                return results;
            });
    }

    function prepareMatchResults(context, results) {
        return {
            matchResults: results,
            isMatchSwapped: context.swapped
        };
    }

    function doNextIteration(context) {
        if (context.params.swapEnabled && !context.swapped) {
            context.swapped = true;
            context.ideActions.rotateAgents()
                .then(context.ideActions.setGameOptionsToManual)
                .then(() => doIteration(context));
        } else {
            context.iteration++;
            if (context.iteration > 1 && context.params.swapEnabled) {
                context.swapped = false;
                context.ideActions.rotateAgents()
                    .then(context.ideActions.setGameOptionsToAuto)
                    .then(() => doIteration(context));
            } else {
                context.ideActions.setGameOptionsToAuto()
                    .then(() => doIteration(context));
            }
        }
    }

    function selectNextOpponent(context) {
        if (context.params.opponentSelectionType !== 'range') return new Promise(resolve => resolve());
        if (context.params.swapEnabled && context.swapped) return new Promise(resolve => resolve());
        let candidates = context.params.candidateAgents;
        let numCandidates = candidates.length;
        let opponent = candidates[Math.floor(Math.random() * numCandidates)];
        return context.ideActions.addAgent(opponent, 1);
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
