'use strict';

var g_matchNum;

chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.action === 'updateResultsWindow') {
        addMatch(request.results, sender.tab.id);
    }
});

function addMatch(results, tabId) {
    g_matchNum = results.matchNum;

    let matchResults = results.match.matchResults; 
    let swapped = results.match.isMatchSwapped;
    let runNum = results.runNum;
    let totalMatches = results.totalMatches
    let userName = results.params.currentUserName;

    if (g_matchNum === 1) populateHeaders(matchResults.rankings, results.params.swapEnabled);
    $('#numMatches').text(g_matchNum + ' / ' + totalMatches);

    addRowToTable(matchResults, results.rollup.matchInfo, runNum, swapped, tabId);
    updateSummary(results.rollup, runNum, swapped, userName);
}

function populateHeaders(rankings, swapping) {
    let header = '<tr>';
    header += '<th><!-- Crash --></th>';
    header += '<th><!-- Replay --></th>';
    header += '<th><!-- Send to IDE --></th>';
    header += '<th>' + chrome.i18n.getMessage('hdrRunNum') + '</th>';
    header += '<th>' + chrome.i18n.getMessage('hdrPlayers') + '</th>';
    header += '<th>' + chrome.i18n.getMessage('hdrWinner') + '</th>';
    header += '<th><!-- STDERR --></th>';
    header += '</tr>';
    $('#resultsTableHead').append(header);

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

    $('#summaryDefault').append('<h4>' + chrome.i18n.getMessage('winsTitle') + ' <span id="defaultWins">0</span></h4>');
    $('#summaryDefault').append('<h4>' + chrome.i18n.getMessage('lossesTitle') + ' <span id="defaultLosses">0</span></h4>');
    $('#summaryDefault').append('<h4>' + chrome.i18n.getMessage('tiesTitle') + ' <span id="defaultTies">0</span></h4>');

    if (swapping) {
        $('#summarySwapped').append('<h4>' + chrome.i18n.getMessage('winsTitle') + ' <span id="swappedWins">0</span></h4>');
        $('#summarySwapped').append('<h4>' + chrome.i18n.getMessage('lossesTitle') + ' <span id="swappedLosses">0</span></h4>');
        $('#summarySwapped').append('<h4>' + chrome.i18n.getMessage('tiesTitle') + ' <span id="swappedTies">0</span></h4>');
    }
}

function addRowToTable(match, matchInfo, runNum, swapped, tabId) {
    let row = '<tr>';
    row += crashButtonCell(match);
    row += replayButtonCell();
    row += sendToIdeButtonCell();
    row += runLabelCell(swapped, runNum);
    row += playersLabelCell(match);
    row += winnerLabelCell(matchInfo);
    row += stderrLinkCell();
    row += '</tr>';

    let tbody = $('#resultsTable tbody');
    tbody.append(row);
    addButtonEventHandlers(tbody, match, tabId);
    enableButtonTooltips();
}

function crashButtonCell(match) {
    return '<td>' + (match.crash
               ? '<button type="button" class="btn btn-danger" id="crashBtn' + g_matchNum + 
                 '" data-toggle="tooltip" title="' + match.crash +
                 '"><span class="glyphicon glyphicon-exclamation-sign" /></button>'
               : '') + '</td>';
}

function replayButtonCell() {
    return '<td><button type="button" class="btn btn-success" id="replayBtn' + g_matchNum +
           '" data-toggle="tooltip" title="' + chrome.i18n.getMessage('replayBtnTip') +
           '"><span class="glyphicon glyphicon-play" /></button></td>';
}

function sendToIdeButtonCell() {
    return '<td><button type="button" class="btn btn-default" id="sendToIdeBtn' + g_matchNum +
           '"data-toggle="tooltip" title="' + chrome.i18n.getMessage('sendBtnTip') +
           '"><span class="glyphicon glyphicon-share-alt" /></button></td>';
}

function runLabelCell(swapped, runNum) {
    let runLabel = swapped ? chrome.i18n.getMessage('swappedRun', [ runNum ]) : runNum;
    return '<td>' + runLabel + '</td>';
}

function playersLabelCell(match) {
    let players = match.rankings.map(_ => playerLabel(_, match));
    return '<td>' + players.join('<br />') + '</td>';
}

function playerLabel(player, match) {
    let agent = match.agents.find(_ => _.name === player.name);
    if (agent && agent.agent.rank) return player.name + ' [' + agent.agent.rank + ']';
    return player.name;
}

function winnerLabelCell(matchInfo) {
    if (matchInfo.tie) return '<td>' + chrome.i18n.getMessage('tiedMatch') + '</td>';
    return '<td>' + matchInfo.winner + '</td>';
}

function stderrLinkCell() {
    return '<td><button type="button" class="btn btn-link" id="stderrBtn' + g_matchNum + '">' +
        chrome.i18n.getMessage('btnStderr') + '</button></td>';
}

function addButtonEventHandlers(tbody, match, tabId) {
    if (match.crash) {
        tbody.on('click', '#crashBtn' + g_matchNum, () => {
            chrome.runtime.sendMessage({
                action: 'showMatchCrashInfo',
                crashInfo: match.crash
            });
        });
    }

    tbody.on('click', '#sendToIdeBtn' + g_matchNum, () => {
        chrome.tabs.sendMessage(tabId, {
            action: 'sendToIde',
            options: match.options,
            agents: match.agents.map(_ => _.agent)
        });
    });

    tbody.on('click', '#stderrBtn' + g_matchNum, () => {
        chrome.runtime.sendMessage({
            action: 'showMatchStderr',
            stderr: match.stderr
        });
    });

    tbody.on('click', '#replayBtn' + g_matchNum, () => {
	    window.open(match.replay);
    });
}

function enableButtonTooltips() {
    $('#replayBtn' + g_matchNum).tooltip({ trigger: 'hover' });
    $('#crashBtn' + g_matchNum).tooltip({ trigger: 'hover' });
    $('#sendToIdeBtn' + g_matchNum).tooltip({ trigger: 'hover' });
}

function findEntryByName(rankings, name) {
    return rankings.find(_ => _.name === name);
}

function updateSummary(results, runNum, swapped, userName) {
    let section = results.defaultOrder;
    let winsId = '#defaultWins';
    let lossesId = '#defaultLosses';
    let tiesId = '#defaultTies';
    if (swapped) {
        section = results.swappedOrder;
        winsId = '#swappedWins';
        lossesId = '#swappedLosses';
        tiesId = '#swappedTies';
    }

    $(winsId).text(section.wins[userName]);
    $(lossesId).text(runNum - section.wins[userName]);
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
