var IdeActions =
(function(options, runner) {
    'use strict';

    var g_runContext;

    function sendMessageToInjectedScript(message) {
        return new Promise(resolve => {
            let actionComplete = message.action + 'Complete';

            let responseFunc = (event) => {
                let data = event.data;
                if (data.action !== actionComplete) return;
                window.removeEventListener('message', responseFunc, false);
                resolve();
            };
            window.addEventListener('message', responseFunc, false);

            window.postMessage(message, '*');
        });
    }

    function rotateAgents() {
        return sendMessageToInjectedScript({action:'rotateAgents'});
    }

    function setGameOptionsToManual() {
        return setGameOptionsManual(true);
    }

    function setGameOptionsToAuto() {
        return setGameOptionsManual(false);
    }

    function setGameOptionsManual(value) {
        return sendMessageToInjectedScript({action:'setGameOptionsManual', value: value});
    }

    function stopPlayback() {
        return sendMessageToInjectedScript({action:'stopPlayback'});
    }

    function playMatch() {
        return sendMessageToInjectedScript({action:'playMatch'});
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
        actions.stopPlayback = stopPlayback;
        actions.playMatch = playMatch;
    };
})(BatchRunOptions, BatchRunner);
