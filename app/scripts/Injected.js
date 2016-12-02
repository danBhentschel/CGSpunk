(function() {
    'use strict';

    $(document).ready(() => {
        angular.element('body').scope().$on('$routeChangeSuccess', (event, route) => {
            let url = route['$$route']['templateUrl'];
            console.log(`routeChangeSuccess: ${url}`);
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

    window.addEventListener('message', function(event) {
        let data = event.data;
        if (data.action === 'rotateAgents') rotateAgents();
        if (data.action === 'setGameOptionsManual') setGameOptionsManual(data.data);
        if (data.action === 'setGameOptionsText') setGameOptionsText(data.data);
        if (data.action === 'playMatch') playMatch();
        if (data.action === 'stopPlayback') stopPlayback();
        if (data.action === 'getAgentsData') getAgentsData();
        if (data.action === 'sendToIde') sendToIde(data.data);
        if (data.action === 'getAgentsAroundAgent') getAgentsAroundAgent(data.data);
        if (data.action === 'getCurrentUser') getCurrentUser();
        if (data.action === 'getCurrentUserArenaAgent') getCurrentUserArenaAgent();
        if (data.action === 'addAgent') addAgent(data.data);
        if (data.action === 'addAgents') addAgents(data.data);
        if (data.action === 'setPlaybackFrame') setPlaybackFrame(data.data);
        if (data.action === 'getGameScores') getGameScores();
    }, false);

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
                return scores;
            })
            .then(scores => window.postMessage({action:'getGameScoresComplete', result: scores}, '*'));
    }

    function getGameScoresForHypersonic(gameManager) {
        var agentNames = gameManager.agents.map(_ => _.name);
        var lastFrameData = gameManager.views[gameManager.views.length-1];
        var playerData = lastFrameData.split('\n').slice(2, 2 + agentNames.length);
        return agentNames.map((_, i) => { return {
            name: _,
            score: parseInt(playerData[i].split(' ')[3], 10)
        }; });
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
                let range = parseInt(data.range, 10);
                let myAgent = allAgents.find(_ => _.pseudo === data.name);
                if (!!myAgent && !!myAgent.league) {
                    allAgents = allAgents.filter(_ => !!_.league && _.league.divisionIndex === myAgent.league.divisionIndex);
                }
                if (!myAgent) myAgent = { rank: allAgents.length - 1 };
                let low = Math.max(0, myAgent.rank - range);
                let high = Math.min(allAgents.length - 1, myAgent.rank + range);

                let agents = [];
                for (let i = low; i <= high; i++) {
                    let thisAgent = allAgents[i];
                    if (thisAgent.pseudo === myAgent.pseudo) continue;
                    agents.push(allAgents[i]);
                }

                return agents;
            })
            .then(agents => window.postMessage({action:'getAgentsAroundAgentComplete', result: agents}, '*'));
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

    if (!angular.isDefined(angular.element('#content').scope()))
        angular.reloadWithDebugInfo();
})();
