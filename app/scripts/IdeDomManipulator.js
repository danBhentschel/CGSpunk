var IdeDomManipulator =
(function(utils) {
    'use strict';

    // NOTE: EVERY public function in this object returns a Promise.

    // public
    function createSwapButton(swapClicked) {
        return new Promise(resolve => {
            let panel = $('.cg-ide-agents-management > .scroll-panel');
            let swapButton = document.createElement('BUTTON');
            swapButton.innerHTML = chrome.i18n.getMessage('btnSwapAgents');
            swapButton.setAttribute('id', 'cgspkSwapButton');
            swapButton.style.padding = '5px 5px 5px 5px';
            panel.append(swapButton);
        
            $('#cgspkSwapButton').click(swapClicked);
            resolve();
        });
    }

    // public
    function createBatchButton(batchClicked) {
        return new Promise(resolve => {
            let panel = $('.cg-ide-agents-management > .scroll-panel');
            let batchButton = document.createElement('BUTTON');
            batchButton.innerHTML = chrome.i18n.getMessage('btnBatchRun');
            batchButton.setAttribute('id', 'cgspkBatchButton');
            batchButton.style.padding = '5px 5px 5px 5px';
            panel.append(batchButton);

            $('#cgspkBatchButton').click(batchClicked);
            resolve();
        });
    }

    // public
    function createStopButton(stopClicked) {
        return new Promise(resolve => {
            let panel = $('.cg-ide-agents-management > .scroll-panel');
            let stopButton = document.createElement('BUTTON');
            stopButton.innerHTML = chrome.i18n.getMessage('btnStopBatch');
            stopButton.setAttribute('id', 'cgspkStopBatchButton');
            stopButton.style.padding = '5px 5px 5px 5px';
            panel.append(stopButton);

            $('#cgspkStopBatchButton').click(stopClicked);
            $('#cgspkStopBatchButton').hide();
            resolve();
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
    };
})(DomUtils);
