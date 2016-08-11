(function(chrome) {
    'use strict';

    var saveButton = document.getElementById('save');
    var iterationCount = document.getElementById('iterationCount');

    function setControlsEnabled(enabled) {
        saveButton.disabled = !enabled;
        iterationCount.disabled = !enabled;
    }

    function saveOptions() {
        var iterations = iterationCount.value;
        setControlsEnabled(false);

        chrome.storage.sync.set({
            iterations: iterations
        }, function() {
            var status = document.getElementById('status');
            status.textContent = 'Saved';
            setTimeout(function() {
                status.textContent = '';
                setControlsEnabled(true);
            }, 750);
        });
    }

    function initializeOptions() {
        chrome.storage.sync.get({
            iterations: 100
        }, function(items) {
            setControlsEnabled(true);
            document.getElementById('iterationCount').value = items.iterations;
        });
    }

    document.addEventListener('DOMContentLoaded', initializeOptions);
    saveButton.addEventListener('click', saveOptions);

})(chrome);
