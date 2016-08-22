'use strict';

var matchNum = 0;
var nameOrder = [];

chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.action === 'updateResultsWindow') {
        addRun(request.results, sender.tab.id);
    }
});

function addRun(results, tabId) {
    let swapEnabled = results.params.swapEnabled;

    let matchResults = results.match.matchResults; 
    if (matchNum === 0) populateHeaders(matchResults.rankings, swapEnabled);

    matchNum++;
    let runNum = results.rollup.defaultOrder.runs.length;
    let swapped = results.match.isMatchSwapped;
    let totalRuns = results.params.iterations;
    let matches = swapEnabled ? totalRuns*2 : totalRuns;
    $('#numMatches').text(matchNum + ' / ' + matches);

    addRowToTable(matchResults, runNum, swapped, tabId);
    updateSummary(results.rollup, swapped);
}

function populateHeaders(rankings, swapping) {
    let header = '<tr>';
    header += '<th><!-- Crash --></th>';
    header += '<th><!-- Replay --></th>';
    header += '<th><!-- Send to IDE --></th>';
    
    header += '<th>' + chrome.i18n.getMessage('hdrRunNum') + '</th>';

    if (swapping) {
        $('#summary').append('<div class="row">' +
                             '<div class="col-xs-6" id="summaryDefault">' +
                             '<h3>' + chrome.i18n.getMessage('defaultOrderLabel') + '</h3></div>' +
                             '<div class="col-xs-6" id="summarySwapped">' +
                             '<h3>' + chrome.i18n.getMessage('swappedOrderLabel') + '</h3></div>' +
                             '</div>');
    } else {
        $('#summary').append('<div class="row"><div class="col-xs-12" id="summaryDefault"></div></div>');
    }

    for (let i = 0; i < rankings.length; i++) {
        let name = rankings[i].name;
        header += '<th>' + name + '</th>';
        nameOrder.push(name);
        $('#summaryDefault').append('<h4>' + name + ': <span id="defaultWins' + i + '">0</span></h4>');
        if (swapping) $('#summarySwapped').append('<h4>' + name + ': <span id="swappedWins' + i + '">0</span></h4>');
    }

    header += '<th>' + chrome.i18n.getMessage('hdrCrash') + '</th>';
    header += '<th><!-- STDERR --></th>';
    header += '</tr>';

    $('#resultsTableHead').append(header);
    $('#summaryDefault').append('<h4>Ties: <span id="defaultTies">0</span></h4>');
    if (swapping) $('#summarySwapped').append('<h4>Ties: <span id="swappedTies">0</span></h4>');
}

function addRowToTable(match, runNum, swapped, tabId) {
    let row = '<tr>';
    row += crashButtonCell(match);
    row += replayButtonCell();
    row += sendToIdeButtonCell();
    row += runLabelCell(swapped, runNum);
    row += rankingLabelCells(match.rankings);
    row += stderrLinkCell();
    row += '</tr>';

    let tbody = $('#resultsTable tbody');
    tbody.append(row);
    addButtonEventHandlers(tbody, match, tabId);
    enableButtonTooltips();
}

function crashButtonCell(match) {
    return '<td>' + (match.crash
               ? '<button type="button" class="btn btn-danger" id="crashBtn' + matchNum + 
                 '" data-toggle="tooltip" title="' + match.crash +
                 '"><span class="glyphicon glyphicon-exclamation-sign" /></button>'
               : '') + '</td>';
}

function replayButtonCell() {
    return '<td><button type="button" class="btn btn-success" id="replayBtn' + matchNum +
           '" data-toggle="tooltip" title="' + chrome.i18n.getMessage('replayBtnTip') +
           '"><span class="glyphicon glyphicon-play" /></button></td>';
}

function sendToIdeButtonCell() {
    return '<td><button type="button" class="btn btn-default" id="sendToIdeBtn' + matchNum +
           '"data-toggle="tooltip" title="' + chrome.i18n.getMessage('sendBtnTip') +
           '"><span class="glyphicon glyphicon-share-alt" /></button></td>';
}

function runLabelCell(swapped, runNum) {
    let runLabel = swapped ? chrome.i18n.getMessage('swappedRun', [ runNum ]) : runNum;
    return '<td>' + runLabel + '</td>';
}

function rankingLabelCells(rankings) {
    var out = '';

    nameOrder.forEach(name => {
        let entry = findEntryByName(rankings, name);
        out += '<td>' + entry.rank + '</td>';
    });

    return out;
}

function stderrLinkCell() {
    return '<td><button type="button" class="btn btn-link" id="stderrBtn' + matchNum + '">' +
        chrome.i18n.getMessage('btnStderr') + '</button></td>';
}

function addButtonEventHandlers(tbody, match, tabId) {
    if (match.crash) {
        tbody.on('click', '#crashBtn' + matchNum, () => {
            chrome.runtime.sendMessage({
                action: 'showMatchCrashInfo',
                crashInfo: match.crash
            });
        });
    }

    tbody.on('click', '#sendToIdeBtn' + matchNum, () => {
        chrome.tabs.sendMessage(tabId, {
            action: 'sendToIde',
            options: match.options,
            agents: match.agents
        });
    });

    tbody.on('click', '#stderrBtn' + matchNum, () => {
        chrome.runtime.sendMessage({
            action: 'showMatchStderr',
            stderr: match.stderr
        });
    });

    tbody.on('click', '#replayBtn' + matchNum, () => {
	    window.open(match.replay);
    });
}

function enableButtonTooltips() {
    $('#replayBtn' + matchNum).tooltip({ trigger: 'hover' });
    $('#crashBtn' + matchNum).tooltip({ trigger: 'hover' });
    $('#sendToIdeBtn' + matchNum).tooltip({ trigger: 'hover' });
}

function findEntryByName(rankings, name) {
    return rankings.find(_ => _.name === name);
}

function updateSummary(results, swapped) {
    let section = results.defaultOrder;
    let winsId = '#defaultWins';
    let tiesId = '#defaultTies';
    if (swapped) {
        section = results.swappedOrder;
        winsId = '#swappedWins';
        tiesId = '#swappedTies';
    }

    for (let i = 0; i < nameOrder.length; i++) {
        $(winsId + i).text(section.wins[nameOrder[i]]);
    }

    $(tiesId).text(section.ties);

    if (swapped) addSignificantRuns(results);
}

function addSignificantRuns(results) {
    let runNum = results.defaultOrder.runs.length;
    let significant = false;
    let defaultRankings = rankingsForRun(results.defaultOrder, runNum);
    let swappedRankings = rankingsForRun(results.swappedOrder, runNum);

    swappedRankings.forEach(ranking => {
        if (significant || ranking.rank != 1) return;
        let defaultRanking = findEntryByName(defaultRankings, ranking.name);
        if (defaultRanking.rank != 1) significant = true;
    });

    if (!significant) return;

    if ($('#significantRuns').length === 0) {
        $('#summary').append('<div class="row"><div class="col-xs-12">' +
                             '<h3>' + chrome.i18n.getMessage('significantRunsLabel') + '</h3>' +
                             '<h4 id="significantRuns">' + runNum + '</h4>' +
                             '</div></div>');
    } else {
        $('#significantRuns').append(', ' + runNum);
    }
}

function rankingsForRun(section, runNum) {
    return section.runs[runNum-1].matchResults.rankings;
}
