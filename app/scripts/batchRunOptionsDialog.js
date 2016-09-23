(function() {
'use strict';

    var numPlayerSlots = 2;

    $(document).ready(() => {
        numPlayerSlots = parseInt(QueryStringHelper.getParameter(document.URL, 'numPlayerSlots'), 10);

        loadSavedValuesFromStorage();

        $('#startRunButton').click(onStartRunButtonClicked);

        $('#opponentRange').on('shown.bs.tab', () => $('#opponentSelectOptions').collapse('show'));
        $('#opponentRange').on('hidden.bs.tab', () => $('#opponentSelectOptions').collapse('hide'));
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
            arenaCodeEnabled: $('#enableArenaCode').prop('checked'),
            opponentSelectionType: readOpponentSelectionTypeFromForm(),
            opponentSelectionRange: $('#selectRange').val(),
            numOpponents: readNumOpponentsFromForm()
        };
    }

    function readOpponentSelectionTypeFromForm() {
        return $('#opponentSelectionType > li.active > a').is('#opponentCurrent')
            ? 'current' : 'range';
    }

    function readNumOpponentsFromForm() {
        if (numPlayerSlots == 2) return 1;
        let selectedOption = $('#numOpponents > li.active > a');
        if (selectedOption.is('#numOpponents1')) return 1;
        if (selectedOption.is('#numOpponents2')) return 2;
        if (selectedOption.is('#numOpponents3')) return 3;
    }

    var defaultStorageValues = {
        iterations: 25,
        swapEnabled: false,
        arenaCodeEnabled: false,
        opponentSelectionType: 'current',
        opponentSelectionRange: 10,
        numOpponents: 1
    };

    function loadSavedValuesFromStorage() {
        chrome.storage.sync.get(defaultStorageValues, insertSavedValuesIntoForm);
    }

    function insertSavedValuesIntoForm(items) {
        $('#iterations').val(items.iterations);
        $('#enableSwap').prop('checked', items.swapEnabled);
        $('#enableArenaCode').prop('checked', items.arenaCodeEnabled);
        $('#selectRange').val(items.opponentSelectionRange);

        if (items.opponentSelectionType === 'current') $('#opponentCurrent').tab('show');
        else $('#opponentRange').tab('show');

        restoreSavedNumOpponentsValue(items.numOpponents);
    }

    function restoreSavedNumOpponentsValue(numOpponents) {
        if (numPlayerSlots == 2) $('#numOpponentsSection').hide();
        else {
            if (numOpponents == 1) $('#numOpponents1').tab('show');
            if (numOpponents == 2) $('#numOpponents2').tab('show');
            if (numPlayerSlots == 3) {
                $('#numOpponents3').hide();
                if (numOpponents == 3) $('#numOpponents2').tab('show');
            } else {
                if (numOpponents == 3) $('#numOpponents3').tab('show');
            }
        }
    }
})();
