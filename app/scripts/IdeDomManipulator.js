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
    function getAgentNames() {
        return new Promise(resolve => {
            resolve($('.agent').map(function() {
                    return $(this).find('.nickname').text();
                }).get());
        });
    }

    // public
    function deleteAgent(name) {
        return new Promise(resolve => {
            $('.agent')
                .find('.nickname:contains("' + name + '")')
                .closest('.agent')
                .find('.delete-button')
                .click();

            resolve();
        });
    }

    // public
    function addAgent(name) {
        return new Promise(resolve => {
            clickAddPlayerSquare()
                .then(getAgentSelectionSearchBox)
                .then(searchBox => searchForName(searchBox, name))
                .then(() => clickAddButton(name))
                .then(resolve);
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
    function getResultsOfRun() {
        return new Promise(resolve => {
            waitForResults(resolve);
        });
    }

    // ***************** All private after here ****************

    function clickAddPlayerSquare() {
        return getAddPlayerSquare()
            .then(square => square.click());
    }

    function getAddPlayerSquare() {
        return new Promise(resolve => {
            let tryFind = () => {
                let square = $('.add-player-square').eq(0);
                if (square.length) {
                    resolve(square);
                } else {
                    setTimeout(tryFind, 200);
                }
            };

            setTimeout(tryFind, 200);
        });
    }

    function getAgentSelectionSearchBox() {
        return new Promise(resolve => {
            let tryFind = () => {
                let searchBox = $('.field');
                if (searchBox.length && searchBox.closest('.searchfield').length) {
                    resolve(searchBox);
                } else {
                    setTimeout(tryFind, 200);
                }
            };

            setTimeout(tryFind, 200);
        });
    }

    function searchForName(searchBox, name) {
        searchBox.val(name);
        searchBox[0].focus();
        utils.pressEnter(searchBox[0]);

        return waitForAgentAddCardVisible(name);
    }

    function waitForAgentAddCardVisible(name) {
        return new Promise(resolve => {
            let tryFind = () => {
                if (isAgentAddCardVisible(name)) {
                    resolve();
                } else {
                    setTimeout(tryFind, 200);
                }
            };

            setTimeout(tryFind, 200);
        });
    }

    function isAgentAddCardVisible(name) {
        return $('.player-add-card').find('.agent-card-nickname:contains("' + name + '")').length > 0;
    }

    function clickAddButton(name) {
        $('.player-add-card')
            .find('.agent-card-nickname:contains("' + name + '")')
            .closest('.player-add-card')
            .find('.add-agent-button')
            .click();
    }

    function waitForResults(resolve) {
        let rankedNames = $('.cg-ide-mini-leaderboard').find('.nickname');
        if ($('.play').is(':disabled') || rankedNames.length == 0) {
            setTimeout(() => { waitForResults(resolve); }, 200);
        } else {
            getResults(rankedNames).then(results => resolve(results));
        }
    }

    function getResults(rankedNames) {
        return new Promise(resolve => {
            pauseReplay().then(() => resolve(doGetResults(rankedNames)));
        });
    }

    function pauseReplay() {
        return new Promise(resolve => {
            if (replayIsPlaying()) {
                $('.play-pause-button').click();
                setTimeout(() => { waitForReplayToStop(resolve); }, 50);
            } else {
                resolve();
            }
        });
    }

    function replayIsPlaying() {
        return $('.player').is('.playing');
    }

    function waitForReplayToStop(resolve) {
        if (replayIsPlaying()) {
            setTimeout(() => { waitForReplayToStop(resolve); }, 50);
        } else {
            resolve();
        }
    }

    function doGetResults(rankedNames) {
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
        pauseReplay().then
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

        // Agent methods
        manipulator.getAgentNames = getAgentNames;
        manipulator.deleteAgent = deleteAgent;
        manipulator.addAgent = addAgent;

        // Batch methods
        manipulator.clickPlayButton = clickPlayButton;
        manipulator.getResultsOfRun = getResultsOfRun;
    };
})(DomUtils);
