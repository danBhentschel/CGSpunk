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
            if (!g_inIde) { $(document).on('DOMNodeInserted', checkForAgentPanel); console.log('Detected IDE'); }
            g_inIde = true;
        } else {
            g_inIde = false;
        }
    }

    function checkForAgentPanel(event) {
        if ($(event.target).is('.cg-ide-agents-management') && 
            $('.cg-ide-agents-management > .scroll-panel').length) {
console.log('Detected agents panel');
            $(document).off('DOMNodeInserted', checkForAgentPanel);
            dom.createSwapButton(actions.rotateAgents);
            dom.createBatchButton(actions.batchRun);
            dom.createStopButton(actions.stopBatch);
        }
    }

})(IdeDomManipulator, IdeActions);
