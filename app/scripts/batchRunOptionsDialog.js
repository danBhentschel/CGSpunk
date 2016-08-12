'use strict';

$(document).ready(() => {
    $('#startRunButton').click(() => {
        let iterations = $('#iterations').val();

        chrome.storage.sync.set({ iterations: iterations });

        chrome.runtime.sendMessage({
            action: 'sendBatchOptionSelections',
            options: {
                iterations: iterations
            }
        });

        window.close();
    });

    chrome.storage.sync.get({ iterations: 25 }, (items) => {
        $('#iterations').val(items.iterations);
    });
});
