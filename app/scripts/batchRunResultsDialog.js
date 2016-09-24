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

    if (g_matchNum === 1) showSummary(results);
    $('#numMatches').text(g_matchNum + ' / ' + totalMatches);

    addRowToTable(match, results, tabId);
    updateSummary(results);
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
    let winners = getWinnersForRankings(rankings);
    if (winners.length > 1) return '<td>' + chrome.i18n.getMessage('tiedMatch') + '</td>';
    return '<td>' + winners[0].name + '</td>';
}

function getWinnersForRankings(rankings) {
    return rankings.filter(_ => _.rank === 1);
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

function updateSummary(results) {
    let userName = results.userName;
    let matches = results.matches.map(_ => calcMatchInfo(_, userName));

    let match = matches[matches.length-1];
    let swapNum = match.swapNum;
    let type = match.type;

    let typeId = type === 'ide'
        ? 'Ide' : (type === 'arena' ? 'Arena' : '');
    let fieldId = typeId + 'Position' + (swapNum+1);
    let winsId = '#wins' + fieldId;
    let lossesId = '#losses' + fieldId;
    let tiesId = '#ties' + fieldId;

    let wins = findMatchesOfStatus(matches, swapNum, type, 'w').length;
    let losses = findMatchesOfStatus(matches, swapNum, type, 'l').length;
    let ties = findMatchesOfStatus(matches, swapNum, type, 't').length;

    $(winsId).text(wins);
    $(lossesId).text(losses);
    $(tiesId).text(ties);

    addSwapSignificantRuns(results, matches);
    addCodeSignificantRuns(results, matches);
}

function calcMatchInfo(match, userName) {
    return {
        iteration: match.data.iteration,
        swapNum: match.data.swapNum,
        type: match.data.type,
        status: calcMatchStatus(match, userName)
    };
}

function calcMatchStatus(match, userName) {
    let rankings = match.results.rankings;
    let winners = getWinnersForRankings(rankings);

    if (winners.length === 1) return winners[0].name === userName ? 'w' : 'l';
    return winners.filter(_ => _.name === userName).length ? 't' : 'l';
}

function findMatchesOfStatus(matches, swapNum, type, status) {
    return matches.filter(_ => _.swapNum === swapNum  &&
                               _.type === type &&
                               _.status === status);
}

function addSwapSignificantRuns(results, matches) {
    if (!results.swapEnabled) return;

    let match = matches[matches.length-1];
    if (match.swapNum !== results.numOpponents) return;

    let iterations = match.iteration;
    let type = match.type;

    let significant = [];
    for (let i = 0; i <= iterations; i++) {
        let isSignificant = matches.filter(_ => _.iteration == i &&
                                                _.type === type)
            .reduce((status, _) => status === null
                    ? _.status : (status === _.status ? status : 'x'), null)
            == 'x';
        if (isSignificant) significant.push(i+1);
    }

    if (!significant.length) return;

    $('#' + type + 'SignificantRuns').show();
    $('#' + type + 'SignificantRunsVal').text(significant.join(', '));
}

function addCodeSignificantRuns(results, matches) {
    if (!results.arenaCodeEnabled) return;

    let match = matches[matches.length-1];
    if (match.type !== 'arena') return;

    let iteration = match.iteration;
    let swapNum = match.swapNum;

    let isSignificant = matches.filter(_ => _.iteration == iteration &&
                                            _.swapNum == swapNum)
        .reduce((status, _) => status === null
                ? _.status : (status === _.status ? status : 'x'), null)
        == 'x';

    if (!isSignificant) return;

    $('#codeSignificantRuns').show();
    let val = $('#codeSignificantRunsVal').text();
    if (val.length) val += ', ';
    val = val + (iteration+1);
    if (results.swapEnabled) val += ' (pos: ' + (swapNum+1) + ')';
    $('#codeSignificantRunsVal').text(val);
}
