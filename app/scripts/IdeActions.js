var IdeActions =
(function(dom, options, runner) {
    'use strict';

    var g_runContext;

    function rotateAgents() {
        dom.getAgentNames()
            .then(deleteEachAgent)
            .then(shiftAgentNames)
            .then(addEachAgent);
    }

    function deleteEachAgent(agentNames) {
        let promise = dom.deleteAgent(agentNames[0]);
        for (let i = 1; i < agentNames.length; i++)
            promise = promise.then(() => dom.deleteAgent(agentNames[i]));

        return promise.then(() => agentNames);
    }

    function addEachAgent(agentNames) {
        let promise = dom.addAgent(agentNames[0]);
        for (let i = 1; i < agentNames.length; i++)
            promise = promise.then(() => dom.addAgent(agentNames[i]));

        return promise.then(() => agentNames);
    }

    function shiftAgentNames(agentNames) {
        let shifted = agentNames.slice();
        shifted.push(shifted.shift());
        return shifted;
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
})(IdeDomManipulator, BatchRunOptions, BatchRunner);
