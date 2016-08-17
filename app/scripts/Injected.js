(function() {
    'use strict';

    window.addEventListener('message', function(event) {
        let data = event.data;
        if (data.action === 'rotateAgents') rotateAgents();
        if (data.action === 'setGameOptionsManual') setGameOptionsManual(data.value);
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
            setTimeout(() => { checkForAgentsAdded(name, index); }, 10);
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
            setTimeout(() => { checkForGameOptionsManual(value); }, 10);
        }
    }

    if (!angular.isDefined(angular.element('#content').scope()))
        angular.reloadWithDebugInfo();
})();
