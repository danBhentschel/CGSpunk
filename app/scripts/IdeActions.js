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

    function setGameOptionsText(value) {
        return sendMessageToInjectedScript({action:'setGameOptionsText', data: value});
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
                return runData;
            })
            .then(runData => addMatchesToParams(runData, params));
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

    function addMatchesToParams(runData, params) {
        if (!!params.matches && params.matches.length > 0) return params;

        let matches = [];

        for (let i = 0; i < params.iterations; i++)
            matches = addMatchesForIteration(matches, i, runData, params);

        params.matches = matches;

        return params;
    }

    function addMatchesForIteration(matches, iteration, runData, params) {
        let opponents = params.opponentSelectionType === 'current'
            ? getCurrentOpponents(runData)
            : getRandomOpponents(runData, params.numOpponents);

        let players = opponents.slice(0);
        let ide = runData.myAgents.ide;
        let swapNum = 0;
        let autoGameOptions = true;
        players.splice(0, 0, ide);
        do {
            matches.push(newMatch(players, autoGameOptions, 'ide', swapNum, iteration));
            autoGameOptions = false;
            players = players.slice(0);
            players.unshift(players.pop());
            swapNum++;
        } while (params.swapEnabled &&
                 players[0].pseudo != ide.pseudo);

        if (!params.arenaCodeEnabled) return matches;

        players = opponents.slice(0);
        swapNum = 0;
        players.splice(0, 0, runData.myAgents.arena);
        do {
            matches.push(newMatch(players, false, 'arena', swapNum, iteration));
            players = players.slice(0);
            players.unshift(players.pop());
            swapNum++;
        } while (params.swapEnabled &&
                 players[0].pseudo != ide.pseudo);

        return matches;
    }

    function getCurrentOpponents(runData) {
        let me = runData.myAgents.ide.pseudo;
        return runData.currentPlayers.filter(player => isNotMe(player, me));
    }

    function isNotMe(player, me) {
        if (player.pseudo === me) return false;
        if (!player.codingamer) return true;
        return player.codingamer.pseudo !== me;
    }

    function getRandomOpponents(runData, num) {
        let opponents = [];
        let candidates = runData.candidateAgents.slice(0);
        for (let i = 0; i < num; i++) {
            if (candidates.length === 0) break;
            var opponentNum = getRandomOpponentNum(candidates);
            opponents.push(candidates[opponentNum]);
            candidates.splice(opponentNum, 1);
        }

        return opponents;
    }

    function getRandomOpponentNum(candidates) {
        return Math.floor(Math.random() * candidates.length);
    }

    function newMatch(players, autoGameOptions, type, swapNum, iteration) {
        return {
            iteration: iteration,
            gameOptions: autoGameOptions ? '**auto' : '**manual',
            agents: players,
            type: type,
            swapNum: swapNum
        };
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
        actions.setGameOptionsText = setGameOptionsText;
        actions.stopPlayback = stopPlayback;
        actions.playMatch = playMatch;
        actions.getAgentsData = getAgentsData;
        actions.sendToIde = sendToIde;
        actions.getCurrentUser = getCurrentUser;
        actions.addAgent = addAgent;
        actions.addAgents = addAgents;
        actions.getGameScores = getGameScores;
    };
})(BatchRunOptions, BatchRunner);
