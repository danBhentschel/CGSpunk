(function(dom, actions) {
    'use strict';

    window.addEventListener('message', event => {
        let data = event.data;
        if (data.action === 'multiplayerIdeLoadedEvent') onMultiplayerIdeLoaded();
    }, false);

    function onMultiplayerIdeLoaded() {
        dom.createSwapButton(actions.rotateAgents);
        dom.createBatchButton(actions.batchRun);
        dom.createStopButton(actions.stopBatch);
    }

    chrome.runtime.onMessage.addListener(request => {
        if (request.action === 'sendToIde') actions.sendToIde(request);
    });

})(IdeDomManipulator, IdeActions);
