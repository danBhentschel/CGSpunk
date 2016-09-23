'use strict';

var g_instanceNum = QueryStringHelper.getParameter(document.URL, 'instanceNum');
var g_batchNum = -1;
var g_matchNum;

chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.action === 'updateResultsWindow') {
        addMatch(request.results, sender.tab.id);
    }
});

function addMatch(results, tabId) {
    if (g_batchNum === -1) g_batchNum = results.batchNum;
    if (g_instanceNum != results.instanceNum) return;
    if (g_batchNum != results.batchNum) return;

    g_matchNum = results.matches.length;

    let match = results.matches[g_matchNum-1]; 
    let iteration = match.iteration;
    let totalMatches = results.totalMatches
    let userName = results.userName;

    if (g_matchNum === 1) showSummary(results);
    $('#numMatches').text(g_matchNum + ' / ' + totalMatches);

    addRowToTable(match, results, tabId);
    updateSummary(results.rollup, runNum, swapped, userName);
}

function showSummary(results) {
    if (results.swapEnabled) {
        $('#hdrIdePosition1').show();
        if (results.arenaCodeEnabled) $('#hdrArenaPosition1').show();
        $('#divIdePosition2').show();
        if (results.arenaCodeEnabled) $('#divArenaPosition2').show();

        if (results.numOpponents > 1) {
            $('#ideExtraPositions').show();
            if (results.arenaCodeEnabled) $('#arenaExtraPositions').show();
            $('#divIdePosition3').show();
            if (results.arenaCodeEnabled) $('#divArenaPosition3').show();
        }

        if (results.numOpponents > 2) {
            $('#divIdePosition4').show();
            if (results.arenaCodeEnabled) $('#divArenaPosition4').show();
        }
    }

    if (results.arenaCodeEnabled) {
        $('#hdrIdeCode').show();
        $('#arenaRow').show();
        $('#hdrArenaCode').show();
    }
}

function addRowToTable(match, results, tabId) {
    let row = '<tr>';
    row += crashButtonCell(match.results);
    row += replayButtonCell();
    row += sendToIdeButtonCell();
    row += runLabelCell(match, results);
    row += playersLabelCell(match);
    row += winnerLabelCell(match.results.rankings);
    row += stderrLinkCell();
    row += '</tr>';

    let tbody = $('#resultsTable tbody');
    tbody.append(row);
    addButtonEventHandlers(tbody, match, tabId);
    enableButtonTooltips();
}

function crashButtonCell(matchResults) {
    return '<td>' + (!!matchResults.crash
               ? '<button type="button" class="btn btn-danger" id="crashBtn' + g_matchNum + 
                 '" data-toggle="tooltip" title="' + matchResults.crash +
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

function runLabelCell(match, results) {
    let iteration = match.data.iteration + 1;
    let swapNum = match.data.swapNum + 1;
    let type = match.data.type;

    let runLabel = iteration;
    if (results.swapEnabled) {
        if (results.arenaCodeEnabled && type === 'ide')
            runLabel = chrome.i18n.getMessage('swappedIdeRun', [ iteration, swapNum ]);
        else if (results.arenaCodeEnabled && type === 'arena')
            runLabel = chrome.i18n.getMessage('swappedArenaRun', [ iteration, swapNum ]);
        else if (!results.arenaCodeEnabled)
            runLabel = chrome.i18n.getMessage('swappedRun', [ iteration, swapNum ]);

    } else {
        if (results.arenaCodeEnabled && type === 'ide')
            runLabel = chrome.i18n.getMessage('ideRun', [ iteration ]);
        else if (results.arenaCodeEnabled && type === 'arena')
            runLabel = chrome.i18n.getMessage('arenaRun', [ iteration ]);
    }

    return '<td>' + runLabel + '</td>';
}

function playersLabelCell(match) {
    let players = match.results.rankings.map(_ => playerLabel(_, match));
    return '<td>' + players.join('<br />') + '</td>';
}

function playerLabel(player, match) {
    let agent = match.data.agents.find(_ => nameForAgent(_) === player.name);
    if (agent && agent.rank) return player.name + ' [' + agent.rank + ']';
    return player.name;
}

function nameForAgent(agent) {
    if (!!agent.pseudo) return agent.pseudo;
    return agent.codingamer.pseudo;
}

function winnerLabelCell(rankings) {
    let winners = rankings.filter(_ => _.rank === 1);
    if (winners.length > 1) return '<td>' + chrome.i18n.getMessage('tiedMatch') + '</td>';
    return '<td>' + winners[0].name + '</td>';
}

function stderrLinkCell() {
    return '<td><button type="button" class="btn btn-link" id="stderrBtn' + g_matchNum + '">' +
        chrome.i18n.getMessage('btnStderr') + '</button></td>';
}

function addButtonEventHandlers(tbody, match, tabId) {
    if (match.results.crash) {
        tbody.on('click', '#crashBtn' + g_matchNum, () => {
            chrome.runtime.sendMessage({
                action: 'showMatchCrashInfo',
                crashInfo: match.results.crash
            });
        });
    }

    tbody.on('click', '#sendToIdeBtn' + g_matchNum, () => {
        chrome.tabs.sendMessage(tabId, {
            action: 'sendToIde',
            options: match.data.gameOptions,
            agents: match.data.agents
        });
    });

    tbody.on('click', '#stderrBtn' + g_matchNum, () => {
        chrome.runtime.sendMessage({
            action: 'showMatchStderr',
            stderr: match.results.stderr
        });
    });

    tbody.on('click', '#replayBtn' + g_matchNum, () => {
	    window.open(match.results.replay);
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
