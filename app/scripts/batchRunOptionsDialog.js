(function() {
'use strict';

    var ideTabId;

    $(document).ready(() => {
        ideTabId = parseInt(QueryStringHelper.getParameter(document.URL, 'tabId'), 10);

        loadSavedValuesFromStorage();

        $('#startRunButton').click(onStartRunButtonClicked);

        $('#opponentRange').on('shown.bs.tab', () => $('#opponentSelectRange').collapse('show'));
        $('#opponentRange').on('hidden.bs.tab', () => $('#opponentSelectRange').collapse('hide'));
    });

    function onStartRunButtonClicked() {
        let options = readOptionsFromForm();

        chrome.storage.sync.set(options);

        chrome.runtime.sendMessage({
            action: 'sendBatchOptionSelections',
            options: options
        });

        window.close();
    }

    function readOptionsFromForm() {
        return {
            iterations:  $('#iterations').val(),
            swapEnabled: $('#enableSwap').prop('checked'),
            opponentSelectionType: readOpponentSelectionTypeFromForm(),
            opponentSelectionRange: $('#selectRange').val()
        };
    }

    function readOpponentSelectionTypeFromForm() {
        return $('#opponentSelectionType > li.active > a').is('#opponentCurrent')
            ? 'current' : 'range';
    }

    var defaultStorageValues = {
        iterations: 25,
        swapEnabled: false,
        opponentSelectionType: 'current',
        opponentSelectionRange: 10
    };

    function loadSavedValuesFromStorage() {
        chrome.storage.sync.get(defaultStorageValues, insertSavedValuesIntoForm);
    }

    function insertSavedValuesIntoForm(items) {
        $('#iterations').val(items.iterations);
        $('#enableSwap').prop('checked', items.swapEnabled);
        if (items.opponentSelectionType === 'current') {
            $('#opponentCurrent').tab('show');
        } else {
            $('#opponentRange').tab('show');
        }
        $('#selectRange').val(items.opponentSelectionRange);
    }
})();
