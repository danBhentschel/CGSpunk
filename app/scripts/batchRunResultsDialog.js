'use strict';

var runs = 0;
var nameOrder = [];

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'updateResultsWindow') {
        addRun(request.results);
    }
});

function addRun(results) {
    if (runs === 0) populateHeaders(results.match.rankings);

    runs++;
    $('#numRuns').text(runs + ' / ' + results.iterations);

    addRowToTable(results.match);
    updateSummary(results.rollup);
}

function populateHeaders(rankings) {
    let header = '<tr><th>Run #</th>';

    for (let i = 0; i < rankings.length; i++) {
        var name = rankings[i].name;
        header += '<th>' + name + '</th>';
        nameOrder.push(name);
        $('#summary').append('<h3>' + name + ': <span id="wins' + i + '">0</span></h3>');
    }

    header += '<th>Crash</th><th>Options</th><th>STDERR</th><th>Replay</th></tr>';

    $('#resultsTableHead').append(header);
    $('#summary').append('<h3>Ties: <span id="ties">0</span></h3>');
}

function addRowToTable(match) {
    let rankings = match.rankings;
    let row = '<tr><td>' + runs + '</td>';

    for (let i = 0; i < nameOrder.length; i++) {
        let entry = rankings.find(_ => _.name == nameOrder[i]);
        row += '<td>' + entry.rank + '</td>';
    }

    row += '<td>' + (match.crash
               ? '<button type="button" class="btn btn-danger" id="crashBtn' + runs + '"><span class="glyphicon glyphicon-exclamation-sign"></span></button>'
               : '') + '</td>';
    row += '<td><button type="button" class="btn btn-default" id="optionsBtn' + runs + '">See options</button></td>';
    row += '<td><button type="button" class="btn btn-default" id="stderrBtn' + runs + '">See STDERR</button></td>';
    row += '<td><button type="button" class="btn btn-default" id="replayBtn' + runs + '"><span class="glyphicon glyphicon-share-alt"></span></button></td>';
    row += '</tr>';

    let tbody = $('#resultsTable tbody');

    tbody.append(row);

    if (match.crash) {
        tbody.on('click', '#crashBtn' + runs, () => {
            chrome.runtime.sendMessage({
                action: 'showMatchCrashInfo',
                crashInfo: match.crash
            });
        });
    }

    tbody.on('click', '#optionsBtn' + runs, () => {
        chrome.runtime.sendMessage({
            action: 'showMatchOptions',
            options: match.options
        });
    });

    tbody.on('click', '#stderrBtn' + runs, () => {
        chrome.runtime.sendMessage({
            action: 'showMatchStderr',
            stderr: match.stderr
        });
    });

    tbody.on('click', '#replayBtn' + runs, () => {
	window.open(match.replay);
    });
}

function updateSummary(results) {
    for (let i = 0; i < nameOrder.length; i++) {
        $('#wins' + i).text(results.wins[nameOrder[i]]);
    }

    $('#ties').text(results.ties);
}
