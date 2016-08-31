(function(dom, actions) {
    'use strict';

    let g_inIde = false;

    // CG in an SPA, so there's no real good event to key off of,
    // without digging into the AngularJS guts, to detect when
    // the URL changes. So this just checks periodically to see
    // if the user enters (or exits) the IDE.

    setInterval(checkForIde, 200);

    function checkForIde() {
        if (window.location.href.startsWith('https://www.codingame.com/ide/')) {
            if (!g_inIde) { $(document).on('DOMNodeInserted', checkForAgentPanel); }
            g_inIde = true;
        } else {
            g_inIde = false;
        }
    }

    function checkForAgentPanel(event) {
        if ($(event.target).is('.cg-ide-agents-management') && 
            $('.cg-ide-agents-management > .scroll-panel').length) {

            $(document).off('DOMNodeInserted', checkForAgentPanel);

            dom.createSwapButton(actions.rotateAgents);
            dom.createBatchButton(actions.batchRun);
            dom.createStopButton(actions.stopBatch);
        }
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
