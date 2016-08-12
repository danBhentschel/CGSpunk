var BatchRunner =
(function(dom, recorder, reporter) {

    function runBatch(params) {
        dom.toggleBatchButtons();

        let context = {
            params: params,
            results: recorder.createNew(),
            iteration: 1,
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

        dom.clickPlayButton();
        dom.getResultsOfRun().then(results => {
            context.results = recorder.recordMatch(results, context.results);
            reporter.reportMatch(results, context.results);
            context.iteration++;
            doIteration(context);
        });
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
