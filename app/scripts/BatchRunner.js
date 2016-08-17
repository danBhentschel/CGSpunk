var BatchRunner =
(function(dom, recorder, reporter) {

    function runBatch(params, ideActions) {
        dom.toggleBatchButtons();
        chrome.runtime.sendMessage({action:'showResultsWindow'});

        let context = {
            params: params,
            ideActions: ideActions,
            results: recorder.createNew(),
            iteration: 1,
            swapped: false,
            stop: false
        };

        doIteration(context);

        return context;
    }

    function doIteration(context) {
        if (context.iteration > context.params.iterations || context.stop) {
            dom.toggleBatchButtons();
            return;
        }

        context.ideActions.playMatch()
            .then(context.ideActions.stopPlayback)
            .then(dom.getResultsOfMatch)
            .then(results => addAgentsInfoToResults(context.ideActions, results))
            .then(results => {
                context.results = recorder.recordMatch(results, context.results);
                reporter.reportMatch(results, context.results, context.params);
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

    function doNextIteration(context) {
        if (context.params.runSwapped && !context.swapped) {
            context.swapped = true;
            context.ideActions.rotateAgents()
                .then(context.ideActions.setGameOptionsToManual)
                .then(() => doIteration(context));
        } else {
            context.iteration++;
            if (context.iteration > 1 && context.params.runSwapped) {
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

    function stopBatch(context) {
        context.stop = true;
    }

    return new function() {
        let runner = this;

        runner.runBatch = runBatch;
        runner.stopBatch = stopBatch;
    };
})(IdeDomManipulator, BatchRunRecorder, BatchResultsReporter);
