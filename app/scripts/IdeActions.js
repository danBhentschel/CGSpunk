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

    function setGameOptionsToManual() {
        return setGameOptionsManual(true);
    }

    function setGameOptionsToAuto() {
        return setGameOptionsManual(false);
    }

    function setGameOptionsManual(value) {
        return new Promise(resolve => {
            let responseFunc = (event) => {
                let data = event.data;
                if (data.action !== 'setGameOptionsManualComplete') return;
                window.removeEventListener('message', responseFunc, false);
                resolve();
            };
            window.addEventListener('message', responseFunc, false);

            window.postMessage({action:'setGameOptionsManual', value: value}, '*');
        });
    }

    function batchRun() {
        options.getRunParameters()
            .then(params => {
                g_runContext = runner.runBatch(params, IdeActions);
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
        actions.setGameOptionsToManual = setGameOptionsToManual;
        actions.setGameOptionsToAuto = setGameOptionsToAuto;
    };
})(BatchRunOptions, BatchRunner);
