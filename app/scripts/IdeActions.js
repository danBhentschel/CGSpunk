var IdeActions =
(function(options, runner, generator) {
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

    function setGameOptionsText(value) {
        return sendMessageToInjectedScript({action:'setGameOptionsText', data: value});
    }

    function stopPlayback() {
        return sendMessageToInjectedScript({action:'stopPlayback'});
    }

    function playMatch() {
        return sendMessageToInjectedScript({action:'playMatch'});
    }

    function waitForPlayMatch() {
        return sendMessageToInjectedScript({action:'waitForPlayMatch'});
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

    function getAgentsAroundAgent(name, range) {
        return sendMessageToInjectedScript({action:'getAgentsAroundAgent', data: {name: name, range: range}});
    }

    function getAgentsInRange(name, rangeFrom, rangeTo) {
        return sendMessageToInjectedScript({action:'getAgentsInRange', data: {name: name, rangeFrom: rangeFrom, rangeTo: rangeTo}});
    }

    function getCurrentUserArenaAgent() {
        return sendMessageToInjectedScript({action:'getCurrentUserArenaAgent'});
    }

    function addAgent(agent, index) {
        return sendMessageToInjectedScript({action:'addAgent', data: {index: index, agent: agent}});
    }

    function addAgents(agents) {
        return sendMessageToInjectedScript({action:'addAgents', data: {agents: agents}});
    }

    function getGameScores() {
        return sendMessageToInjectedScript({action:'getGameScores'});
    }

    function getGameEndState() {
        return sendMessageToInjectedScript({action:'getGameEndState'});
    }

    function getResultsOfMatch() {
        return sendMessageToInjectedScript({action:'getResultsOfMatch'});
    }

    function batchRun() {
        getCurrentUserArenaAgent()
            .then(agent => options.getRunParameters(!!agent))
            .then(prepareBatchRun)
            .then(params => {
                if (!params) return;
                g_runContext = runner.runBatch(params, IdeActions);
            });
    }

    function prepareBatchRun(params) {
        if (!params) return;
        return addMyAgentsToRunData({}, params)
            .then(runData => addCandidateAgentsToRunData(runData, params))
            .then(runData => addCurrentPlayersToRunData(runData, params))
            .then(runData => {
                params.initialAgents = runData.currentPlayers;
                if (!!runData.myAgents.arena) {
                    params.arenaRank = runData.myAgents.arena.rank;
                }
                return runData;
            })
            .then(runData => generator.addMatchesToParams(runData, params));
    }

    function addMyAgentsToRunData(runData, params) {
        return getCurrentUserArenaAgent()
            .then(agent => {
                runData.myAgents = { arena: agent };
                if (!!agent) {
                    runData.myAgents.ide = ideAgent(agent.pseudo);
                    return runData;
                }

                return getCurrentUserName()
                    .then(name => {
                        runData.myAgents.ide = ideAgent(name);
                        return runData;
                    });
            });
    }

    function ideAgent(name) {
        return {
            agentId: -1,
            pseudo: name,
            specialAgent: true
        };
    }

    function addCandidateAgentsToRunData(runData, params) {
        if (params.opponentSelectionType === 'custom')
            return addAgentsInCustomRangeToRunData(runData, params);

        if (params.opponentSelectionType !== 'range')
            return new Promise(resolve => resolve(runData));

        return getCurrentUserName()
            .then(name => getAgentsAroundAgent(name, params.opponentSelectionRange))
            .then(agents => {
                runData.candidateAgents = agents;
                return runData;
            });
    }

    function addAgentsInCustomRangeToRunData(runData, params) {
        return getCurrentUserName()
            .then(name => getAgentsInRange(name, params.opponentRangeFrom, params.opponentRangeTo))
            .then(agents => {
                runData.candidateAgents = agents;
                return runData;
            });
    }

    function getCurrentUserName() {
        return getCurrentUser().then(user => { return user.pseudo; });
    }

    function addCurrentPlayersToRunData(runData, params) {
        return getAgentsData()
            .then(agents => {
                runData.currentPlayers = agents.map(_ => _.agent);
                return runData;
            });
    }

    function stopBatch() {
        runner.stopBatch(g_runContext);
    }

    chrome.runtime.onMessage.addListener((request, sender) => {
        if (request.action === 'stopBatch') {
            runner.stopBatchForInstance(request.instanceNum, g_runContext);
        }
    });

    function onPlay() {
        setTimeout(() => {
            chrome.storage.sync.get({
                showLogOnMultiPlay: true
            }, items => {
                if (items.showLogOnMultiPlay) {
                    doOnPlay();
                }
            });
        }, 200);
    }

    function doOnPlay() {
        waitForPlayMatch()
            .then(result => {
                if (!result.didPlay) {
                    return;
                }

                debounceGetResultsOfPlay();
            });
    }

    var g_debounceAlreadyGettingResults = false;
    function debounceGetResultsOfPlay() {
        if (g_debounceAlreadyGettingResults) {
            return;
        }
        g_debounceAlreadyGettingResults = true;
        setTimeout(() => {
            g_debounceAlreadyGettingResults = false;
            getResultsOfMatch()
                .then(showLogWindowForMatch);
        }, 200);
    }

    function showLogWindowForMatch(results) {
        chrome.runtime.sendMessage({
            action: 'showLiveMatchGameLog',
            gameLog: results.history
        });
    }

    return new function() {
        let actions = this;

        actions.rotateAgents = rotateAgents;
        actions.batchRun = batchRun;
        actions.stopBatch = stopBatch;
        actions.setGameOptionsToManual = setGameOptionsToManual;
        actions.setGameOptionsToAuto = setGameOptionsToAuto;
        actions.setGameOptionsText = setGameOptionsText;
        actions.stopPlayback = stopPlayback;
        actions.playMatch = playMatch;
        actions.getAgentsData = getAgentsData;
        actions.sendToIde = sendToIde;
        actions.getCurrentUser = getCurrentUser;
        actions.addAgent = addAgent;
        actions.addAgents = addAgents;
        actions.getGameScores = getGameScores;
        actions.getGameEndState = getGameEndState;
        actions.getResultsOfMatch = getResultsOfMatch;
        actions.onPlay = onPlay;
    };
})(BatchRunOptions, BatchRunner, MatchGenerator);
