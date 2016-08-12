'use strict';

$(document).ready(() => {
    chrome.runtime.sendMessage({ action: 'getLastOptions' }, options => {
        $('#options').text(options);
    });
});
