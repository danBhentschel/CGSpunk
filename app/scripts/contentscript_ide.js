(function(dom, actions) {
    'use strict';

        let data = event.data;
        if (data.action === 'multiplayerIdeLoadedEvent') onMultiplayerIdeLoaded();
    }, false);

    function onMultiplayerIdeLoaded() {
        dom.createSwapButton(actions.rotateAgents);
        dom.createBatchButton(actions.batchRun);
        dom.createStopButton(actions.stopBatch);
    }

    function injectScript() {
        let script = document.createElement('script');
        script.src = chrome.extension.getURL('scripts/Injected.js');
        let html = document.getElementsByTagName('html')[0];
        html.appendChild(script);
    }

    $(document).ready(injectScript);

    chrome.runtime.onMessage.addListener(request => {
        if (request.action === 'sendToIde') actions.sendToIde(request);
    });

    let ngDebugStr = 'NG_ENABLE_DEBUG_INFO!';
    if (window.name.indexOf(ngDebugStr) === -1) {
        window.name = ngDebugStr + window.name
    }

})(IdeDomManipulator, IdeActions);
