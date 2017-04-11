(function(dom, actions) {
    'use strict';

    dom.removeButtons();

    setTimeout(() => {
        window.addEventListener('message', onMessage, false);
    }, 100);

    function onMessage(event) {
        let data = event.data;
        if (data.action === 'removeEventListeners') {
            window.removeEventListener('message', onMessage, false);
        } else if (data.action === 'multiplayerIdeLoadedEvent') {
            onMultiplayerIdeLoaded();
        }
    }

    function onMultiplayerIdeLoaded() {
        dom.createSwapButton(actions.rotateAgents);
        dom.createBatchButton(actions.batchRun);
        dom.createStopButton(actions.stopBatch);
    }

    chrome.runtime.onMessage.addListener(request => {
        if (request.action === 'sendToIde') actions.sendToIde(request);
    });

})(IdeDomManipulator, IdeActions);
