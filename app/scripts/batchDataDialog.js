'use strict';

$(document).ready(() => {
    chrome.runtime.sendMessage({ action: 'getLastBatchData' }, data => {
        $('#batchData').text(JSON.stringify(data, null, 2));
    });
});
