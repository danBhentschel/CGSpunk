var IdeActions =
(function(options, runner) {
    'use strict';

    var g_runContext;

    function rotateAgents() {
        return new Promise(resolve => {
            let responseFunc = (event) => {
                let data = event.data;
                if (data.action !== 'rotateAgentsComplete') return;
                window.removeEventListener('message', responseFunc, false);
                resolve();
            };
            window.addEventListener('message', responseFunc, false);

            window.postMessage({action:'rotateAgents'}, '*');
        });
    }

    function batchRun() {
        options.getRunParameters()
            .then(params => {
                g_runContext = runner.runBatch(params);
            });
    }

    function stopBatch() {
        runner.stopBatch(g_runContext);
    }

    return new function() {
        let actions = this;

        actions.rotateAgents = rotateAgents;
        actions.batchRun = batchRun;
        actions.stopBatch = stopBatch;
    };
})(BatchRunOptions, BatchRunner);
