(function(chrome) {
    'use strict';

    var g_optionsResponseFunc;

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'getBatchRunOptions') {
            g_optionsResponseFunc = sendResponse;
            showBatchRunOptionsWindow(request.numPlayerSlots, request.inArena);
            return true;
        } else if (request.action === 'sendBatchOptionSelections') {
            g_optionsResponseFunc(request.options);
        } else if (request.action === 'showResultsWindow') {
            showResultsWindow(request.instanceNum, sender.tab.id);
        } else if (request.action === 'showMatchGameLog') {
            showGameLogWindow(request.gameLog, sender.tab.id);
        } else if (request.action === 'showLiveMatchGameLog') {
            showLiveGameLogWindow(request.gameLog, sender.tab.id);
        } else if (request.action === 'showMatchCrashInfo') {
            showCrashInfoWindow(request.crashInfo);
        } else if (request.action === 'showBatchData') {
            showBatchDataWindow(request.data);
        } else if (request.action === 'getLastGameLog') {
            sendResponse({ log: g_lastGameLog, params: g_lastGameLogParams });
        } else if (request.action === 'getLastCrashInfo') {
            sendResponse(g_lastCrashInfo);
        } else if (request.action === 'getLastBatchData') {
            sendResponse(g_lastBatchData);
        }
    });

    function showBatchRunOptionsWindow(numPlayerSlots, inArena) {
        chrome.windows.create({
            url: 'dialogs/batchRunOptions.html?numPlayerSlots=' + numPlayerSlots +
                 '&inArena=' + inArena,
            type: 'popup',
            width: 600,
            height: 700
        });
    }

    function showResultsWindow(instanceNum, tabId) {
        chrome.windows.create({
            url: `dialogs/batchRunResults.html?instanceNum=${instanceNum}&tabId=${tabId}`,
            type: 'popup',
            width: 700,
            height: 600
        });
    }

    var g_lastGameLog;
    var g_lastGameLogParams;
    var g_liveGameLogWindowId;

    function showGameLogWindow(gameLog, params) {
        g_lastGameLog = gameLog;
        g_lastGameLogParams = params;

        let windowParams = {
            url: 'dialogs/matchGameLog.html',
            type: 'popup',
            width: 600,
            height: 600
        };

        if (!!params && !!params.rect) {
            windowParams.width = params.rect.width;
            windowParams.height = params.rect.height;
            if (!!params.rect.x && !!params.rect.y) {
                windowParams.left = params.rect.x;
                windowParams.top = params.rect.y;
            }
        }

        chrome.windows.create(windowParams, createdWindow => {
            // Firefox doesn't seem to position it correctly on creation
            chrome.windows.update(createdWindow.id, {left: windowParams.left, top: windowParams.top});
            if (params.isLive) g_liveGameLogWindowId = createdWindow.id;
        });
    }

    function showLiveGameLogWindow(gameLog, tabId) {
        chrome.runtime.sendMessage({
            action: 'updateMatchGameLog',
            tabId: tabId,
            log: gameLog
        }, response => {
            if (!response || response === 'reload') {
                chrome.storage.sync.get(
                    { 'liveGameLogWindowPosition': { width: 600, height: 600 } },
                    items => {
                        let params = {
                            tabId: tabId,
                            isLive: true,
                            rect: items.liveGameLogWindowPosition
                        };
                        showGameLogWindow(gameLog, params);
                    });
            }
            else if (response === 'focus') {
                chrome.windows.update(g_liveGameLogWindowId, {focused: true});
            }
        });
    }

    var g_lastCrashInfo;

    function showCrashInfoWindow(info) {
        g_lastCrashInfo = info;
        chrome.windows.create({
            url: 'dialogs/matchCrashInfo.html',
            type: 'popup',
            width: 600,
            height: 600
        });
    }

    var g_lastBatchData;

    function showBatchDataWindow(data) {
        g_lastBatchData = data;
        chrome.windows.create({
            url: 'dialogs/batchData.html',
            type: 'popup',
            width: 700,
            height: 700
        });
    }

    chrome.runtime.onInstalled.addListener(details => {
        setTimeout(() => {
            if (details.reason === 'install' ||
                details.reason === 'update') {
                reloadScripts();
            }
        }, 1000);
    });

    function reloadScripts() {
        executeInAllTabs(chrome.runtime.getManifest().content_scripts[0].js);
    }

    function executeInAllTabs(scripts) {
	chrome.tabs.query({ currentWindow: true}, tabs => {
            tabs.forEach(tab => {
                scripts.forEach(script => {
                    chrome.tabs.executeScript(tab.id, { file: script }, () => {
                        if (!!chrome.runtime.lastError) {
                            console.log(chrome.runtime.lastError.message);
                        }
                    });
                });
            });
        });
    }

})(chrome);
