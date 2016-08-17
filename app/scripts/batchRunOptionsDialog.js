'use strict';

$(document).ready(() => {
    $('#startRunButton').click(() => {
        let iterations = $('#iterations').val();
        let swapEnabled = $('#enableSwap').prop('checked');

        chrome.storage.sync.set({
            iterations: iterations,
            swapEnabled: swapEnabled
        });

        chrome.runtime.sendMessage({
            action: 'sendBatchOptionSelections',
            options: {
                iterations: iterations,
                runSwapped: swapEnabled
            }
        });

        window.close();
    });

    chrome.storage.sync.get({ iterations: 25, swapEnabled: false }, (items) => {
        $('#iterations').val(items.iterations);
        $('#enableSwap').prop('checked', items.swapEnabled);
    });
});
