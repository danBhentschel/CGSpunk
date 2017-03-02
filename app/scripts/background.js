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
        showGameLogWindow(request.gameLog);
    } else if (request.action === 'showMatchCrashInfo') {
        showCrashInfoWindow(request.crashInfo);
    } else if (request.action === 'showBatchData') {
        showBatchDataWindow(request.data);
    } else if (request.action === 'getLastGameLog') {
        sendResponse(g_lastGameLog);
    } else if (request.action === 'getLastCrashInfo') {
        sendResponse(g_lastCrashInfo);
    } else if (request.action === 'getLastBatchData') {
        sendResponse(g_lastBatchData);
    }
});

chrome.storage.sync.get({ 'newFeatures': 0 }, items => {
    if (items.newFeatures >= 216) return;
    chrome.notifications.create('new-features', {
        type: 'basic',
        iconUrl: 'images/CGSpunk_128.png',
        title: 'New in CG Spunk 0.2.16',
        message: 'At the request of CodinGame staff, CG Spunk now inserts a delay between matches of a batch run.',
        requireInteraction: true,
        buttons: [ { title: 'More information' } ]
    }, notificationId => {
        chrome.notifications.onButtonClicked.addListener((buttonNotificationId, buttonIndex) => {
            if (buttonNotificationId === notificationId && buttonIndex == 0) {
                chrome.tabs.create({ url: 'https://github.com/danBhentschel/CGSpunk/issues/62' });
            }
        });
    });
    chrome.storage.sync.set({ 'newFeatures': 216 });
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

function showGameLogWindow(gameLog) {
    g_lastGameLog = gameLog;
    chrome.windows.create({
        url: 'dialogs/matchGameLog.html',
        type: 'popup',
        width: 600,
        height: 600
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
