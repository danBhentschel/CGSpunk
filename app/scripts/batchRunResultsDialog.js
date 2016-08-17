'use strict';

var matchNum = 0;
var nameOrder = [];

chrome.runtime.onMessage.addListener((request, sender) => {
    if (request.action === 'updateResultsWindow') {
        addRun(request.results, sender.tab.id);
    }
});

function addRun(results, tabId) {
    if (matchNum === 0) populateHeaders(results.match.rankings);

    matchNum++;
    var runSwapped = results.params.runSwapped;
    var runNum = runSwapped ? Math.ceil(matchNum/2) : matchNum;
    var swapped = runSwapped ? matchNum%2 === 0 : false;
    var runs = results.params.iterations;
    var matches = runSwapped ? runs*2 : runs;
    $('#numRuns').text(matchNum + ' / ' + matches);

    addRowToTable(results.match, runNum, swapped, tabId);
    updateSummary(results.rollup);
}

function populateHeaders(rankings) {
    let header = '<tr><th><!-- Replay --></th>';
    header += '<th><!-- Send to IDE --></th>';
    
    header += '<th>' + chrome.i18n.getMessage('hdrRunNum') + '</th>';

    for (let i = 0; i < rankings.length; i++) {
        var name = rankings[i].name;
        header += '<th>' + name + '</th>';
        nameOrder.push(name);
        $('#summary').append('<h3>' + name + ': <span id="wins' + i + '">0</span></h3>');
    }

    header += '<th>' + chrome.i18n.getMessage('hdrCrash') + '</th>';
    header += '<th><!-- STDERR --></th>';
    header += '</tr>';

    $('#resultsTableHead').append(header);
    $('#summary').append('<h3>Ties: <span id="ties">0</span></h3>');
}

function addRowToTable(match, runNum, swapped, tabId) {
    let rankings = match.rankings;
    let row = '<tr>';
    row += '<td><button type="button" class="btn btn-success" id="replayBtn' + matchNum +
           '" data-toggle="tooltip" title="' + chrome.i18n.getMessage('replayBtnTip') +
           '"><span class="glyphicon glyphicon-play" /></button></td>';
    row += '<td><button type="button" class="btn btn-default" id="sendToIdeBtn' + matchNum +
           '"data-toggle="tooltip" title="' + chrome.i18n.getMessage('sendBtnTip') +
           '"><span class="glyphicon glyphicon-share-alt" /></button></td>';
    var runLabel = swapped ? chrome.i18n.getMessage('swappedRun', [ runNum ]) : runNum;
    row += '<td>' + runLabel + '</td>';

    for (let i = 0; i < nameOrder.length; i++) {
        let entry = rankings.find(_ => _.name == nameOrder[i]);
        row += '<td>' + entry.rank + '</td>';
    }

    row += '<td>' + (match.crash
               ? '<button type="button" class="btn btn-danger" id="crashBtn' + matchNum + 
                 '" data-toggle="tooltip" title="' + match.crash +
                 '"><span class="glyphicon glyphicon-exclamation-sign" /></button>'
               : '') + '</td>';
    row += '<td><button type="button" class="btn btn-link" id="stderrBtn' + matchNum + '">' +
        chrome.i18n.getMessage('btnStderr') + '</button></td>';
    row += '</tr>';

    let tbody = $('#resultsTable tbody');

    tbody.append(row);

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

    $('#replayBtn' + matchNum).tooltip({ trigger: 'hover' });
    $('#crashBtn' + matchNum).tooltip({ trigger: 'hover' });
    $('#sendToIdeBtn' + matchNum).tooltip({ trigger: 'hover' });
}

function updateSummary(results) {
    for (let i = 0; i < nameOrder.length; i++) {
        $('#wins' + i).text(results.wins[nameOrder[i]]);
    }

    $('#ties').text(results.ties);
}
