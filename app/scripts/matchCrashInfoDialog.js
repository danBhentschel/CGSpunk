'use strict';

$(document).ready(() => {
    chrome.runtime.sendMessage({ action: 'getLastCrashInfo' }, info => {
        $('#crashInfo').text(info);
    });
});
