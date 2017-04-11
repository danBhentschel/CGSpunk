(function(chrome) {
    'use strict';

    function setControlsEnabled(enabled) {
        $('#checkShowLogOnMultiPlay').prop('disabled', !enabled);
        $('#save').prop('disabled', !enabled);
    }

    function saveOptions() {
        setControlsEnabled(false);

        chrome.storage.sync.set({
            showLogOnMultiPlay: $('#checkShowLogOnMultiPlay').prop('checked')
        }, function() {
            $('#status').html('Saved');
            setTimeout(function() {
                $('#status').html('');
                setControlsEnabled(true);
                window.close();
            }, 750);
        });
    }

    function initializeOptions() {
        chrome.storage.sync.get({
            showLogOnMultiPlay: true
        }, function(items) {
            $('#checkShowLogOnMultiPlay').prop('checked', items.showLogOnMultiPlay);
            setControlsEnabled(true);
        });
    }

    $( document ).ready(() => {
        $('#save').click(saveOptions);
        initializeOptions();
    });

})(chrome);
