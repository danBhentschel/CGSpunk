(function() {
'use strict';

    var numPlayerSlots = 2;
    var inArena = true;

    var isFirefox = typeof InstallTrigger !== 'undefined';
    var isEdge = !!window.StyleMedia;

    var storageLocation = isFirefox ? chrome.storage.local : chrome.storage.sync;

    $(document).ready(() => {
        numPlayerSlots = parseInt(QueryStringHelper.getParameter(document.URL, 'numPlayerSlots'), 10);
        inArena = QueryStringHelper.getParameter(document.URL, 'inArena') === 'true';

        loadSavedValuesFromStorage();

        if (inArena) $('#divEnableArenaCode').show();

        $('#startRunButton').click(onStartRunButtonClicked);

        $('#opponentCurrent').on('shown.bs.tab', () => $('#opponentNumberOptions').collapse('hide'));
        $('#opponentCurrent').on('hidden.bs.tab', () => $('#opponentNumberOptions').collapse('show'));
        $('#opponentRange').on('shown.bs.tab', () => $('#opponentSelectOptions').collapse('show'));
        $('#opponentRange').on('hidden.bs.tab', () => $('#opponentSelectOptions').collapse('hide'));
        $('#opponentCustomRange').on('shown.bs.tab', () => $('#opponentCustomRangeOptions').collapse('show'));
        $('#opponentCustomRange').on('hidden.bs.tab', () => $('#opponentCustomRangeOptions').collapse('hide'));
    });

    function onStartRunButtonClicked() {
        let options;

        if ($('#advancedTabs > li.active > a').is('#formTab')) {
            options = readOptionsFromForm();
            storageLocation.set(options);
        } else {
            options = JSON.parse($('#json').val());
        }

        if (!inArena) options.arenaCodeEnabled = false;

        chrome.runtime.sendMessage({
            action: 'sendBatchOptionSelections',
            options: options
        });

        // http://stackoverflow.com/a/8135456/3119991
        if (isEdge) {
            var objWin = window.self;
            objWin.open('','_self','');
            objWin.close();
        } else {
            window.close();
        }
    }

    function readOptionsFromForm() {
        return {
            iterations:  parseInt($('#iterations').val()),
            swapEnabled: $('#enableSwap').prop('checked'),
            arenaCodeEnabled: $('#enableArenaCode').prop('checked'),
            opponentSelectionType: readOpponentSelectionTypeFromForm(),
            opponentSelectionRange: parseInt($('#selectRange').val()),
            opponentRangeFrom: parseInt($('#rangeFrom').val()),
            opponentRangeTo: parseInt($('#rangeTo').val()),
            numOpponents: readNumOpponentsFromForm()
        };
    }

    function readOpponentSelectionTypeFromForm() {
        if ($('#opponentSelectionType > li.active > a').is('#opponentCurrent')) return 'current';
        if ($('#opponentSelectionType > li.active > a').is('#opponentRange')) return 'range';
        return 'custom';
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
        opponentRangeFrom: 1,
        opponentRangeTo: 10,
        numOpponents: 1
    };

    function loadSavedValuesFromStorage() {
        storageLocation.get(defaultStorageValues, insertSavedValuesIntoForm);
    }

    function insertSavedValuesIntoForm(items) {
        $('#iterations').val(items.iterations);
        $('#enableSwap').prop('checked', items.swapEnabled);
        $('#enableArenaCode').prop('checked', items.arenaCodeEnabled);
        $('#selectRange').val(items.opponentSelectionRange);
        $('#rangeFrom').val(items.opponentRangeFrom);
        $('#rangeTo').val(items.opponentRangeTo);

        if (items.opponentSelectionType === 'current') $('#opponentCurrent').tab('show');
        else if (items.opponentSelectionType === 'range') $('#opponentRange').tab('show');
        else $('#opponentCustomRange').tab('show');

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
