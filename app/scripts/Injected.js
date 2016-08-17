(function() {
    'use strict';

    window.addEventListener('message', function(event) {
        let data = event.data;
        if (data.action === 'rotateAgents') rotateAgents();
        if (data.action === 'setGameOptionsManual') setGameOptionsManual(data.value);
        if (data.action === 'playMatch') playMatch();
        if (data.action === 'stopPlayback') stopPlayback();
    }, false);

    function rotateAgents() {
        let names = angular.element('.agent').map(function() {
            return $(this).find('.nickname').text();
        }).get();

        let scopes = angular.element('.agent').map(function() {
            return $(this).scope();
        }).get();

        let agents = scopes.map(scope => scope.$parent.agent);
        agents.push(agents.shift());

        for (let i = 0; i < scopes.length; i++) {
            scopes[i].api.addAgent(agents[i], i);
            scopes[i].$apply();
        }

        checkForAgentsAdded(names[agents.length-1], 0);
    }

    function checkForAgentsAdded(name, index) {
        let found = angular.element('.agent').eq(index).find('.nickname').text();
        if (found === name) {
            window.postMessage({action:'rotateAgentsComplete'}, '*');
        } else {
            setTimeout(() => checkForAgentsAdded(name, index), 10);
        }
    }

    function setGameOptionsManual(value) {
        let scope = angular.element('.cg-ide-game-options-editor').scope();
        scope.apis.gameOptions.gameOptionsManual = value;
        scope.$apply();

        checkForGameOptionsManual(value);
    }

    function checkForGameOptionsManual(value) {
        if (angular.element('.options-text').prop('readonly') !== value) {
            window.postMessage({action:'setGameOptionsManualComplete'}, '*');
        } else {
            setTimeout(() => checkForGameOptionsManual(value), 10);
        }
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

    if (!angular.isDefined(angular.element('#content').scope()))
        angular.reloadWithDebugInfo();
})();
