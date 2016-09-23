var IdeDomManipulator =
(function(utils) {
    'use strict';

    // NOTE: EVERY public function in this object returns a Promise.

    // public
    function createSwapButton(swapClicked) {
        return getAgentsScrollPanel()
            .then(panel => {
                if ($('#cgspkSwapButton').length > 0) return;
                let swapButton = document.createElement('BUTTON');
                swapButton.innerHTML = chrome.i18n.getMessage('btnSwapAgents');
                swapButton.setAttribute('id', 'cgspkSwapButton');
                swapButton.style.padding = '5px 5px 5px 5px';
                panel.append(swapButton);
        
                $('#cgspkSwapButton').click(swapClicked);
            });
    }

    // public
    function createBatchButton(batchClicked) {
        return getAgentsScrollPanel()
            .then(panel => {
                if ($('#cgspkBatchButton').length > 0) return;
                let batchButton = document.createElement('BUTTON');
                batchButton.innerHTML = chrome.i18n.getMessage('btnBatchRun');
                batchButton.setAttribute('id', 'cgspkBatchButton');
                batchButton.style.padding = '5px 5px 5px 5px';
                panel.append(batchButton);

                $('#cgspkBatchButton').click(batchClicked);
            });
    }

    // public
    function createStopButton(stopClicked) {
        return getAgentsScrollPanel()
            .then(panel => {
                if ($('#cgspkStopBatchButton').length > 0) return;
                let stopButton = document.createElement('BUTTON');
                stopButton.innerHTML = chrome.i18n.getMessage('btnStopBatch');
                stopButton.setAttribute('id', 'cgspkStopBatchButton');
                stopButton.style.padding = '5px 5px 5px 5px';
                panel.append(stopButton);

                $('#cgspkStopBatchButton').click(stopClicked);
                $('#cgspkStopBatchButton').hide();
            });
    }

    // public
    function toggleBatchButtons() {
        return new Promise(resolve => {
            if ($('#cgspkStopBatchButton').is(':visible')) {
                $('#cgspkStopBatchButton').hide();
                $('#cgspkBatchButton').show();
            } else {
                $('#cgspkStopBatchButton').show();
                $('#cgspkBatchButton').hide();
            }

            resolve();
        });
    }

    // public
    function clickPlayButton() {
        return new Promise(resolve => {
            $('.play').click();
            resolve();
        });
    }

    // public
    function getResultsOfMatch() {
        return new Promise(resolve => {
            waitForResults(resolve);
        });
    }

    // public
    function getNumPlayerSlots() {
        return new Promise(resolve => resolve($('.agent').length));
    }
    

    // ***************** All private after here ****************

    function waitForResults(resolve) {
        let rankedNames = $('.cg-ide-mini-leaderboard').find('.nickname');
        if ($('.play').is(':disabled') || rankedNames.length == 0) {
            setTimeout(() => waitForResults(resolve), 200);
        } else {
            resolve(getResults(rankedNames));
        }
    }

    function getResults(rankedNames) {
        let results = {
            rankings: [],
            options: getMatchOptions(),
            stderr: getMatchStderr(),
            crash: getCrashInfo(),
            replay: getReplayUrl()
        };

        rankedNames.each(function() {
            let nameObj = $(this);
            results.rankings.push({
                name: nameObj.text(),
                rank: getRank(nameObj)
            });
        });

        return results;
    }

    function getMatchOptions() {
        return $('.options-text').val();
    }

    function getMatchStderr() {
        let stderr = [];

        $('.stderr > .outputLine').each(function() {
            stderr.push($(this).text());
        });

        return stderr;
    }

    function getRank(nameObj) {
        return parseInt(nameObj.closest('.leaderboard-item').find('.rank-value').eq(0).text(), 10);
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

    function getAgentsScrollPanel() {
        return new Promise(resolve => doGetAgentsScrollPanel(resolve));
    }

    function doGetAgentsScrollPanel(resolve) {
        let panel = $('.cg-ide-agents-management > .scroll-panel');
        if (panel.length > 0) resolve(panel);
        else setTimeout(() => doGetAgentsScrollPanel(resolve), 200);
    }

    return new function() {
        let manipulator = this;

        // Modify the screen content
        manipulator.createSwapButton = createSwapButton;
        manipulator.createBatchButton = createBatchButton;
        manipulator.createStopButton = createStopButton;
        manipulator.toggleBatchButtons = toggleBatchButtons;

        // Batch methods
        manipulator.clickPlayButton = clickPlayButton;
        manipulator.getResultsOfMatch = getResultsOfMatch;
        manipulator.getNumPlayerSlots = getNumPlayerSlots;
    };
})(DomUtils);
