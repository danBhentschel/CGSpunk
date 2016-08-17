(function() {
    'use strict';

    window.addEventListener('message', function(event) {
        let data = event.data;
        if (data.action === 'rotateAgents') rotateAgents();
        if (data.action === 'setGameOptionsManual') setGameOptionsManual(data.value);
        if (data.action === 'playMatch') playMatch();
        if (data.action === 'stopPlayback') stopPlayback();
        if (data.action === 'getAgentsData') getAgentsData();
        if (data.action === 'sendToIde') sendToIde(data.state);
    }, false);

    function rotateAgents() {
        let names = angular.element('.agent').map(function() {
            return $(this).find('.nickname').text();
        }).get();

        let scopes = getScopesForAgents();
        let agents = getAgentsFromScopes(scopes);
        agents.push(agents.shift());

        for (let i = 0; i < scopes.length; i++) {
            scopes[i].api.addAgent(agents[i], i);
            scopes[i].$apply();
        }

        waitForAgentsAdded(names[agents.length-1], 0)
            .then(() => window.postMessage({action:'rotateAgentsComplete'}, '*'));
    }

    function getScopesForAgents() {
        return angular.element('.agent').map(function() {
            return $(this).scope();
        }).get();
    }

    function getAgentsFromScopes(scopes) {
        return scopes.map(scope => scope.$parent.agent);
    }

    function waitForAgentsAdded(name, index) {
        return new Promise(resolve => {
            let found = angular.element('.agent').eq(index).find('.nickname').text();
            if (found === name) {
                resolve();
            } else {
                setTimeout(() => checkForAgentsAdded(name, index), 10);
            }
        });
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
        return new Promise(resolve => {
            if (angular.element('.options-text').prop('readonly') !== value) {
                resolve();
            } else {
                setTimeout(() => checkForGameOptionsManual(value), 10);
            }
        });
    }

    function stopPlayback() {
        waitForGameManager()
            .then(pausePlayback)
            .then(() => waitForPlayback(false))
            .then(() => window.postMessage({action:'stopPlaybackComplete'}, '*'));
    }

    function waitForGameManager() {
        return new Promise(resolve => doWaitForGameManager(resolve));
    }

    function doWaitForGameManager(resolve) {
        let gameManager = angular.element('.play-pause-button').scope().gameManager;
        if (angular.isDefined(gameManager) && gameManager !== null) {
            resolve();
        } else {
            setTimeout(() => doWaitForGameManager(resolve), 10);
        }
    }

    function waitForPlayback(value) {
        return new Promise(resolve => doWaitForPlaybackRunningToBe(value, resolve));
    }

    function doWaitForPlaybackRunningToBe(value, resolve) {
        let gameManager = angular.element('.play-pause-button').scope().gameManager;
        if (angular.isDefined(gameManager) && gameManager !== null && gameManager.playing === value) {
            resolve();
        } else {
            setTimeout(() => doWaitForPlaybackRunningToBe(value, resolve), 10);
        }
    }

    function pausePlayback() {
        return new Promise(resolve => setTimeout(() => {
                angular.element('.play-pause-button').scope().gameManager.pause();
                resolve();
            }, 100));
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

    function startPlay() {
        angular.element('.play').scope().api.play()
    }

    function playIsInProgress() {
        return angular.element('.play').scope().api.playInProgress;
    }

    function getAgentsData() {
        let agents = getAgentsFromScopes(getScopesForAgents());
        window.postMessage({action: 'getAgentsDataComplete', result: agents}, '*');
    }

    function sendToIde(state) {
        let scopes = getScopesForAgents();
        for (let i = 0; i < scopes.length; i++) {
            scopes[i].api.addAgent(state.agents[i], i);
            scopes[i].$apply();
        }

        doSetGameOptionsManual(true)
            .then(() => angular.element('.options-text').val(state.options))
            .then(() => window.postMessage({action:'sendToIdeComplete'}, '*'));
    }

    if (!angular.isDefined(angular.element('#content').scope()))
        angular.reloadWithDebugInfo();
})();
