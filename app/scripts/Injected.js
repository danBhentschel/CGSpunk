var __CGSpunk_Injected = 
(function() {
    'use strict';

    $(document).ready(() => {
        angular.element('body').scope().$on('$routeChangeSuccess', (event, route) => {
            let url = route['$$route']['templateUrl'];
            //console.log(`routeChangeSuccess: ${url}`);
            if (!url) return;
            if (url.includes('modules/ide/')) {
                sendMultiplayerMessageWhenLoaded();
            } else if (url.includes('modules/replay/')) {
                sendReplayMessageWhenLoaded();
            }
        });

        if (location.href.startsWith('https://www.codingame.com/ide/')) {
            sendMultiplayerMessageWhenLoaded();
        } else if (location.href.startsWith('https://www.codingame.com/replay/')) {
            sendReplayMessageWhenLoaded();
        }
    });

    function sendMultiplayerMessageWhenLoaded() {
        waitForIdeApis()
            .then(hasAgents => {
                if (!hasAgents) return;
                window.postMessage({action:'multiplayerIdeLoadedEvent'}, '*');
            });
    }

    function sendReplayMessageWhenLoaded() {
        setTimeout(() => {
        waitForGameManager()
            .then(() => setTimeout(() => window.postMessage({action:'replayPlayerLoadedEvent'}, '*'), 2000));
        }, 2000);
    }

    function waitForIdeApis() {
        return new Promise(resolve => doWaitForIdeApis(resolve));
    }

    function doWaitForIdeApis(resolve) {
        let $scope = angular.element('.ide-content').scope();
        if (!!$scope) {
            resolve(!!($scope.apis.agentsManagement));
        } else {
            setTimeout(() => doWaitForIdeApis(resolve), 100);
        }
    }

    window.addEventListener('message', onMessage, false);

    function onMessage(event) {
        let data = event.data;
        switch (data.action) {
            case 'removeEventListeners':
                window.removeEventListener('message', onMessage, false);
                break;
            case 'rotateAgents':
                rotateAgents();
                break;
            case 'setGameOptionsManual':
                setGameOptionsManual(data.data);
                break;
            case 'setGameOptionsText':
                setGameOptionsText(data.data);
                break;
            case 'playMatch':
                playMatch();
                break;
            case 'waitForPlayMatch':
                waitForPlayMatch();
                break;
            case 'stopPlayback':
                stopPlayback();
                break;
            case 'getAgentsData':
                getAgentsData();
                break;
            case 'sendToIde':
                sendToIde(data.data);
                break;
            case 'getAgentsAroundAgent':
                getAgentsAroundAgent(data.data);
                break;
            case 'getAgentsInRange':
                getAgentsInRange(data.data);
                break;
            case 'getCurrentUser':
                getCurrentUser();
                break;
            case 'getCurrentUserArenaAgent':
                getCurrentUserArenaAgent();
                break;
            case 'addAgent':
                addAgent(data.data);
                break;
            case 'addAgents':
                addAgents(data.data);
                break;
            case 'setPlaybackFrame':
                setPlaybackFrame(data.data);
                break;
            case 'getGameScores':
                getGameScores();
                break;
            case 'getGameEndState':
                getGameEndState();
                break;
            case 'getResultsOfMatch':
                getResultsOfMatch();
                break;
        }
    }

    function rotateAgents() {
        let names = angular.element('.agent').map(function() {
            return $(this).find('.nickname').text();
        }).get();

        let scopes = getScopesForAgents();
        let agents = getAgentsFromScopes(scopes);
        agents.push(agents.shift());

        for (let i = 0; i < agents.length; i++) {
            scopes[i].api.addAgent(agents[i], i);
            scopes[i].$apply();
        }

        waitForAgentsAdded(names[1], 0)
            .then(() => window.postMessage({action:'rotateAgentsComplete'}, '*'));
    }

    function getScopesForAgents() {
        return angular.element('.agent').map(function() {
            return $(this).scope();
        }).get();
    }

    function getAgentsFromScopes(scopes) {
        return scopes.map(scope => scope.$parent.agent).filter(validAgent);
    }

    function validAgent(agent) {
        return agent != null;
    }

    function waitForAgentsAdded(name, index) {
        return new Promise(resolve => doWaitForAgentsAdded(resolve, name, index));
    }

    function doWaitForAgentsAdded(resolve, name, index) {
        let found = angular.element('.agent').eq(index).find('.nickname').text();
        if (found === name) {
            resolve();
        } else {
            setTimeout(() => doWaitForAgentsAdded(resolve, name, index), 10);
        }
    }

    function setGameOptionsManual(value) {
        doSetGameOptionsManual(value)
            .then(() => window.postMessage({action:'setGameOptionsManualComplete'}, '*'));
    }

    function doSetGameOptionsManual(value) {
        let scope = angular.element('.cg-ide-game-options-editor').scope();
        scope.apis.gameOptions.gameOptionsManual = value;
        scope.$apply();

        return waitForGameOptionsManual(value);
    }

    function waitForGameOptionsManual(value) {
        return new Promise(resolve => doWaitForGameOptionsManual(resolve, value));
    }

    function doWaitForGameOptionsManual(resolve, value) {
        if (angular.element('.options-text').prop('readonly') !== value) {
            resolve();
        } else {
            setTimeout(() => doWaitForGameOptionsManual(resolve, value), 10);
        }
    }

    function setGameOptionsText(value) {
        doSetGameOptionsText(value)
            .then(() => window.postMessage({action:'setGameOptionsTextComplete'}, '*'));
    }

    function doSetGameOptionsText(value) {
        let scope = angular.element('.cg-ide-game-options-editor').scope();
        scope.apis.gameOptions.gameOptions = value;
        scope.$apply();

        return waitForGameOptionsText(value);
    }

    function waitForGameOptionsText(value) {
        return new Promise(resolve => doWaitForGameOptionsText(resolve, value));
    }

    function doWaitForGameOptionsText(resolve, value) {
        if (angular.element('.options-text').val() === value) {
            resolve();
        } else {
            setTimeout(() => doWaitForGameOptionsText(resolve, value), 10);
        }
    }

    function getGameScores() {
        waitForGameManager()
            .then(gameManager => {
                var gameName = gameManager.drawer.drawer.question;
                var scores = null;
                if (gameName === 'Hypersonic') scores = getGameScoresForHypersonic(gameManager);
                else if (gameName === 'Fantastic Bits') scores = getGameScoresForFantasticBits(gameManager);
                else if (gameName === 'CodeBusters') scores = getGameScoresForCodeBusters(gameManager);
                else if (gameName === 'Roche') scores = getGameScoresForCode4LifeLikeGame(gameManager);
                else if (gameName === 'WondevWoman') scores = getGameScoresForCode4LifeLikeGame(gameManager);
                return scores;
            })
            .then(scores => window.postMessage({action:'getGameScoresComplete', result: scores}, '*'));
    }

    function getGameScoresForHypersonic(gameManager) {
        let drawer = gameManager.drawer.drawer;
        let numBoxes = drawer.initData.boxes.length;
        let agentIds = gameManager.agents.map(_ => _.agentId);
        return drawer.scope.playerInfo.map(_ => { return {
            name: _.name,
            agentId: agentIds[_.index],
            score: _.score % 100,
            max: numBoxes
        }; });
    }

    function getGameScoresForFantasticBits(gameManager) {
        let index = 5;
        let agentNames = gameManager.agents.map(_ => _.name);
        let agentIds = gameManager.agents.map(_ => _.agentId);
        let lastFrameData = gameManager.views[gameManager.views.length-1].split('\n');
        index += 1 + parseInt(lastFrameData[index], 10);
        let numSnaffles = parseInt(lastFrameData[index], 10);
        index += 1 + numSnaffles;
        index += 1 + parseInt(lastFrameData[index], 10);
        let scores = lastFrameData[index].split(' ');
        return agentNames.map((_, i) => { 
            var score = parseInt(scores[i], 10);
            return {
                name: _,
                agentId: agentIds[i],
                score: score >= 0 ? score : 0,
                max: numSnaffles
            };
        });
    }

    function getGameScoresForCodeBusters(gameManager) {
        let drawer = gameManager.drawer.drawer;
        let numGhosts = parseInt(drawer.initData.ghostCount, 10);
        let agentIds = gameManager.agents.map(_ => _.agentId);
        return drawer.scope.playerInfo.map(_ => { return {
            name: _.name,
            agentId: agentIds[_.index],
            score: _.score >= 0 ? _.score : 0,
            max: numGhosts
        }; });
    }

    function getGameScoresForCode4LifeLikeGame(gameManager) {
        let frames = gameManager.drawer.drawer.frames;
        let lastFrameData = frames[frames.length-1].players;
        return gameManager.agents.map((_, i) => { 
            return {
                name: _.name,
                agentId: _.agentId,
                score: lastFrameData[i].score
            };
        });
    }

    function getGameEndState() {
        waitForGameManager()
            .then(gameManager => getMyStateFromGameManager(gameManager, getUserFromService().pseudo))
            .then(state => window.postMessage({action:'getGameEndStateComplete', result: state}, '*'));
    }

    function getMyStateFromGameManager(gameManager, me) {
        let myAgent = getMyAgentFromGameManager(gameManager, me);
        if (!myAgent) return 'normal';
        let myFrames = gameManager.frames.filter(_ => _.agentId == myAgent.index);
        let info = myFrames[myFrames.length-1].gameInformation;
        if (info.includes('nvalid input')) return 'invalid';
        if (info.includes('Timeout:')) return 'timeout';
        return 'normal';
    }

    function getMyAgentFromGameManager(gameManager, me) {
        let myAgents = gameManager.agents.filter(_ => _.name === me);
        if (myAgents.length === 0) return null;
        if (myAgents.length === 1) return myAgents[0];
        let ideAgents = myAgents.filter(_ => _.agentId === -1);
        if (ideAgents.length === 1) return ideAgents[0];
        return myAgents[0];
    }

    function getGameHistoryFromGameManager(gameManager) {
        let agentNames = gameManager.agents.map(_ => getNameOfAgent(_));
        let frames = gameManager.frames;
        let history = {
            agents: agentNames,
            data: []
        };
        let frameNo = 1;
        while (frameNo < frames.length) {
            let turn = {
                stdout: [],
                stderr: []
            };
            for (let agent = 0; agent < agentNames.length; agent++) {
                if (frameNo >= frames.length) {
                    break;
                }
                let frame = frames[frameNo];
                turn.stdout.push(frame.stdout);
                turn.stderr.push(frame.stderr);
                if (!!frame.summary) {
                    turn.summary = frame.summary;
                }
                frameNo++;
            }
            history.data.push(turn);
        }

        return history;
    }

    function stopPlayback() {
        waitForGameManager()
            .then(gameManager => { gameManager.pause(); return gameManager; })
            .then(gameManager => ensurePlaybackStopped(gameManager))
            .then(() => window.postMessage({action:'stopPlaybackComplete'}, '*'));
    }

    function waitForGameManager() {
        return new Promise(resolve => doWaitForGameManager(resolve));
    }

    function doWaitForGameManager(resolve) {
        if (!(angular.element('.player')) ||
            !(angular.element('.player').scope()) ||
            !(angular.element('.player').scope().gameManager)) {

            setTimeout(() => doWaitForGameManager(resolve), 100);
        } else {
            resolve(angular.element('.player').scope().gameManager);
        }
    }

    function ensurePlaybackStopped(gameManager) {
        return new Promise(resolve => doEnsurePlaybackStopped(resolve, gameManager));
    }

    function doEnsurePlaybackStopped(resolve, gameManager) {
        if (gameManager.playing === false) {
            resolve();
        } else {
            setTimeout(() => doEnsurePlaybackStopped(resolve, gameManager), 100);
        }
    }

    function setPlaybackFrame(frame) {
        waitForGameManager()
            .then(gameManager => { gameManager.setFrame(frame); return gameManager; })
            .then(gameManager => ensurePlaybackFrameSetTo(frame, gameManager))
            .then(() => window.postMessage({action:'setPlaybackFrameComplete'}, '*'));
    }

    function ensurePlaybackFrameSetTo(frame, gameManager) {
        return new Promise(resove => doEnsurePlaybackFrameSetTo(resolve, frame, gameManager));
    }

    function doEnsurePlaybackFrameSetTo(resolve, frame, gameManager) {
        if (gameManager.currentFrame === frame) {
            resolve();
        } else {
            setTimeout(() => doEnsurePlaybackFrameSetTo(resolve, frame, gameManager), 100);
        }
    }

    function playMatch() {
        waitForPlayInProgress(false)
            .then(startPlay)
            .then(() => waitForPlayInProgress(true))
            .then(() => waitForPlayInProgress(false))
            .then(() => window.postMessage({action:'playMatchComplete'}, '*'));
    }

    function waitForPlayMatch() {
        let didPlay = playIsInProgress();

        waitForPlayInProgress(false)
            .then(() => window.postMessage({
                action: 'waitForPlayMatchComplete',
                result: { didPlay: didPlay }
            }, '*'));
    }

    function waitForPlayInProgress(value) {
        return new Promise(resolve => doWaitForPlayInProgress(value, resolve));
    }

    function doWaitForPlayInProgress(value, resolve) {
        if (playIsInProgress() === value) {
            resolve();
        } else {
            setTimeout(() => doWaitForPlayInProgress(value, resolve), 10);
        }
    }

    function playIsInProgress() {
        return angular.element('.play').scope().api.playInProgress;
    }

    function startPlay() {
        angular.element('.play').scope().api.play();
    }

    function getAgentsData() {
        let agents = getAgentsFromScopes(getScopesForAgents());
        agents = agents.map(agent => {
            return {
                agent: agent,
                name: getNameOfAgent(agent),
                imageUrl: getImageUrlForAgent(agent)
            };
        });
        window.postMessage({action: 'getAgentsDataComplete', result: agents}, '*');
    }

    function getNameOfAgent(agent) {
        if (agent.codingamer) return agent.codingamer.pseudo;
        if (agent.arenaboss) return agent.arenaboss.nickname;
        if (!!agent.name) return agent.name;
        return 'Default';
    }

    function getImageUrlForAgent(agent) {
        var style = angular.element('.agent').scope().getAvatarStyleOfAgent(agent);
        if (style == null || !style.hasOwnProperty('background-image')) return '';
        return style['background-image'].replace(/^(url\()/, '').replace(/(\))$/, '');
    }

    function sendToIde(state) {
        let scopes = getScopesForAgents();
        for (let i = 0; i < scopes.length; i++) {
            if (i >= state.agents.length) {
                scopes[i].api.removeAgent(i);
            } else {
                scopes[i].api.addAgent(state.agents[i], i);
            }
            scopes[i].$apply();
        }

        doSetGameOptionsManual(true)
            .then(() => doSetGameOptionsText(state.options))
            .then(() => window.postMessage({action:'sendToIdeComplete'}, '*'));
    }

    function getAgentsAroundAgent(data) {
        waitForLeaderboardToBePopulated(getLeaderboard())
            .then(allAgents => {
                let myRank = findAgentInList(allAgents, data.name).rank;
                let range = parseInt(data.range, 10);
                let low = Math.max(0, myRank - range);
                let high = Math.min(allAgents.length - 1, myRank + range);

                return getAgentsFromTo(allAgents, low, high, myRank);
            })
            .then(agents => window.postMessage({action:'getAgentsAroundAgentComplete', result: agents}, '*'));
    }

    function findAgentInList(allAgents, name) {
        let agent = allAgents.find(_ => _.pseudo === name);
        if (!!agent && !!agent.league) {
            allAgents = allAgents.filter(_ => !!_.league && _.league.divisionIndex === agent.league.divisionIndex);
        }
        if (!agent) agent = { rank: allAgents.length - 1 };
        return agent;
    }

    function getAgentsFromTo(allAgents, low, high, myRank) {
        let agents = [];
        for (let i = low; i <= high; i++) {
            if (i == myRank) continue;
            let thisAgent = allAgents.find(_ => _.rank == i);
            if (!!thisAgent) agents.push(thisAgent);
        }
        return agents;
    }

    function getAgentsInRange(data) {
        waitForLeaderboardToBePopulated(getLeaderboard())
            .then(allAgents => {
                let myRank = findAgentInList(allAgents, data.name).rank;
                let low = parseInt(data.rangeFrom, 10);
                let high = parseInt(data.rangeTo, 10);
                if (low > high) { let tmp = low; low = high; high = tmp; }

                return getAgentsFromTo(allAgents, low, high, myRank);
            })
            .then(agents => window.postMessage({action:'getAgentsInRangeComplete', result: agents}, '*'));
    }

    function getLeaderboard() {
        let scope = getScopesForAgents()[0];
        return scope.api.getLeaderboard();
    }

    function waitForLeaderboardToBePopulated(leaderboard) {
        return new Promise(resolve => doWaitForLeaderboardToBePopulated(leaderboard, resolve));
    }

    function doWaitForLeaderboardToBePopulated(leaderboard, resolve) {
        if (leaderboard.$$state.status) {
            resolve(leaderboard.$$state.value.users);
        } else {
            setTimeout(() => doWaitForLeaderboardToBePopulated(leaderboard, resolve), 10);
        }
    }

    function getCurrentUser() {
        window.postMessage({action:'getCurrentUserComplete', result: getUserFromService()}, '*');
    }

    function getUserFromService() {
        return angular.element('.avatar').injector().get('codinGamerService').codinGamer;
    }

    function getCurrentUserArenaAgent() {
        let me = getUserFromService().pseudo;

        waitForLeaderboardToBePopulated(getLeaderboard())
            .then(allAgents => {
                let myAgent = allAgents.find(_ => _.pseudo === me);
                window.postMessage({action:'getCurrentUserArenaAgentComplete', result: myAgent}, '*');
            });
    }

    function addAgent(addInfo) {
        let index = addInfo.index;
        let agent = addInfo.agent;

        let scopes = getScopesForAgents();
        scopes[index].api.addAgent(agent, index);
        scopes[index].$apply();
        window.postMessage({action:'addAgentComplete'}, '*');
    }

    function addAgents(addInfo) {
        let agents = addInfo.agents;

        let scopes = getScopesForAgents();
        for (let i = 0; i < scopes.length; i++) {
            if (i >= agents.length) {
                scopes[i].api.removeAgent(i);
            } else {
                scopes[i].api.addAgent(agents[i], i);
            }
            scopes[i].$apply();
        }

        window.postMessage({action:'addAgentsComplete'}, '*');
    }

    function getResultsOfMatch() {
        waitForPlayInProgress(false)
            .then(waitForGameManager)
            .then(getResults)
            .then(results => window.postMessage({action:'getResultsOfMatchComplete', result: results}, '*'));
    }

    function getResults(gameManager) {
        return {
            gameName: gameManager.drawer.drawer.question,
            rankings: rankingsForAgents(gameManager.agents),
            options: getMatchOptions(),
            history: getGameHistoryFromGameManager(gameManager),
            crash: getCrashInfo(),
            replay: getReplayUrl()
        };
    }

    function rankingsForAgents(agents) {
        return agents.map(agent => {
            return {
                name: agent.name,
                rank: agent.rank,
                agentId: agent.agentId
            };
        });
    }

    function getMatchOptions() {
        return $('.options-text').val();
    }

    function getCrashInfo() {
        let info = $('.error > .consoleError').text();
        if (!info) return '';
        let next = $('.errorLink.in-answer').text().trim();
        if (next) info += '\n' + next;
        return info;
    }

    function getReplayUrl() {
        let href = $('.replay-button').attr('href');
	    if (href.startsWith('/replay')) href = 'http://www.codingame.com' + href;
	    return href;
    }

    if (!angular.isDefined(angular.element('#content').scope()))
        angular.reloadWithDebugInfo();

    return {
        __FOR_TEST_getMyAgentFromGameManager: getMyAgentFromGameManager,
        __FOR_TEST_getMyStateFromGameManager: getMyStateFromGameManager,
        __FOR_TEST_getGameHistoryFromGameManager: getGameHistoryFromGameManager
    };
})();
