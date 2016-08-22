var IdeActions =
(function(options, runner) {
    'use strict';

    var g_runContext;

    function sendMessageToInjectedScript(message) {
        return new Promise(resolve => sendMessageToInjectedScriptAndWaitForResponse(message, resolve));
    }

    function sendMessageToInjectedScriptAndWaitForResponse(message, sendResponse) { 
        let actionComplete = message.action + 'Complete';

        let responseFunc = (event) => {
                let data = event.data;
            if (data.action !== actionComplete) return;
            window.removeEventListener('message', responseFunc, false);
            sendResponse(data.result);
        };
        window.addEventListener('message', responseFunc, false);

        window.postMessage(message, '*');
    };

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action !== 'ideAction') return;
        sendMessageToInjectedScriptAndWaitForResponse({action: request.ideAction, data: request.data}, sendResponse);
        return true;
    });

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
        return sendMessageToInjectedScript({action:'setGameOptionsManual', data: value});
    }

    function stopPlayback() {
        return sendMessageToInjectedScript({action:'stopPlayback'});
    }

    function playMatch() {
        return sendMessageToInjectedScript({action:'playMatch'});
    }

    function getAgentsData() {
        return sendMessageToInjectedScript({action:'getAgentsData'});
    }

    function getCurrentUser() {
        return sendMessageToInjectedScript({action:'getCurrentUser'});
    }

    function sendToIde(state) {
        return sendMessageToInjectedScript({action:'sendToIde', data: state});
    }

    function getAgentsAroundRank(rank) {
        return sendMessageToInjectedScript({action:'getAgentsAroundRank', data: rank});
    }

    function getCurrentUserArenaAgent() {
        return sendMessageToInjectedScript({action:'getCurrentUserArenaAgent'});
    }

    function addAgent(agent, index) {
        return sendMessageToInjectedScript({action:'addAgent', data: {index: index, agent: agent}});
    }

    function batchRun() {
        options.getRunParameters()
            .then(prepareBatchRun)
            .then(params => {
                g_runContext = runner.runBatch(params, IdeActions);
            });
    }

    function prepareBatchRun(params) {
        return getCurrentUserAgent()
            .then(agent => {
                return getAgentsAroundRank(agent.rank)
                    .then(agents => {
                        params.candidateAgents = agents;
                        return params;
                    });
            });
    }

    function getCurrentUserAgent() {
        return getCurrentUser()
            .then(user => {
                return getAgentsData()
                    .then(agents => {
                        if (agents[0].name === user.pseudo) {
                            var agent = agents[0];
                            agent.rank = user.rank;
                            return agent;
                        }
                        if (agents[1].name === user.pseudo) {
                            var agent = agents[1];
                            agent.rank = user.rank;

                            return rotateAgents()
                                .then(() => { return agent; });
                        }
                        return getCurrentUserArenaAgent()
                            .then(agent => {
                                addAgent(agent, 0)
                                    .then(() => { return agent; });
                            });
                    });
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
        actions.getAgentsData = getAgentsData;
        actions.sendToIde = sendToIde;
        actions.getCurrentUser = getCurrentUser;
        actions.addAgent = addAgent;
    };
})(BatchRunOptions, BatchRunner);
