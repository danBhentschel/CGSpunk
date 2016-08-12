'use strict';

$(document).ready(() => {
    chrome.runtime.sendMessage({ action: 'getLastStderr' }, stderr => {
        $('#stderr').text(stderr.join('\n'));
    });
});
