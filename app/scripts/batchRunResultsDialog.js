var __CGSpunk_batchRunResultsDialog = 
(function() {
    'use strict';

    var g_instanceNum = parseInt(QueryStringHelper.getParameter(document.URL, 'instanceNum'));
    var g_tabId = parseInt(QueryStringHelper.getParameter(document.URL, 'tabId'));
    var g_batchNum = -1;
    var g_matchNum;
    
    chrome.runtime.onMessage.addListener((request, sender) => {
        if (request.action === 'updateResultsWindow') {
            addMatch(request.results);
        }
        if (request.action === 'batchStopped' &&
                request.results.instanceNum === g_instanceNum) {
            showBatchButton(request.results);
        }
        if (request.action === 'batchStopping' &&
                request.instanceNum === g_instanceNum) {
            batchStopping();
        }
    });

    $( document ).ready(() => {
        $('#batchBtn').html(chrome.i18n.getMessage('btnStopBatch'));
        $('#divBatchBtn').on('click', '#batchBtn', () => {
            chrome.tabs.sendMessage(g_tabId, {
                action: 'stopBatch',
                instanceNum: g_instanceNum
            });
        });
    });

    function batchStopping() {
        let button = $('#batchBtn');
        button.html(chrome.i18n.getMessage('btnStoppingBatch'));
        button.prop('disabled', true);
    }
    
    function addMatch(results) {
        if (g_batchNum === -1) g_batchNum = results.batchNum;
        if (g_instanceNum !== results.instanceNum) return;
        if (g_batchNum != results.batchNum) return;
    
        g_matchNum = results.matches.length;
    
        let match = results.matches[g_matchNum-1]; 
        let iteration = match.iteration;
        let totalMatches = results.totalMatches;
        let hasScores = !!match.scores;
    
        if (g_matchNum === 1) showSummary(results, hasScores);
        $('#numMatches').text(g_matchNum + ' / ' + totalMatches);
    
        addRowToTable(match, results);
        updateSummary(match, results);
    
        if (g_matchNum === totalMatches) showBatchButton(results);
    }
    
    function showSummary(results, hasScores) {
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
    
        if (hasScores) {
            $('#ideAverageScore').show();
            $('#scoresColumn').show();
            if (results.arenaCodeEnabled) $('#arenaAverageScore').show();
        }
    
        if (results.numOpponents > 1) {
            $('#ideAveragePlacement').show();
            if (results.arenaCodeEnabled) $('#arenaAveragePlacement').show();
        }
    
        if (results.arenaCodeEnabled) {
            $('#hdrIdeCode').show();
            $('#arenaRow').show();
            $('#hdrArenaCode').show();
        }
    }
    
    function addRowToTable(match, results) {
        let row = '<tr>';
        row += crashButtonCell(match.results);
        row += replayButtonCell();
        row += sendToIdeButtonCell();
        row += runLabelCell(match, results);
        row += playersLabelCell(match, results.userName);
        row += scoresCell(match);
        row += winnerLabelCell(match, results.userName);
        row += stderrLinkCell();
        row += '</tr>';
    
        let tbody = $('#resultsTable tbody');
        tbody.append(row);
        addButtonEventHandlers(tbody, match);
        enableButtonTooltips();
    }
    
    function crashButtonCell(matchResults) {
        if (!!matchResults.crash) {
            return '<td><button type="button" class="btn btn-danger" id="crashBtn' + g_matchNum + 
                '" data-toggle="tooltip" title="' + matchResults.crash +
                '"><span class="glyphicon glyphicon-exclamation-sign" /></button></td>';
        }
    
        if (matchResults.endState == 'invalid') {
            return '<td><button type="button" class="btn btn-danger" id="invalidBtn' + g_matchNum + 
                '" data-toggle="tooltip" title="' + chrome.i18n.getMessage('invalidToolTip') +
                '"><span class="glyphicon glyphicon-question-sign" /></button></td>';
        }
    
        if (matchResults.endState == 'timeout') {
            return '<td><button type="button" class="btn btn-danger" id="timeoutBtn' + g_matchNum + 
                '" data-toggle="tooltip" title="' + chrome.i18n.getMessage('timeoutToolTip') +
                '"><span class="glyphicon glyphicon-time" /></button></td>';
        }
    
        return '<td></td>';
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
        let iteration = (match.data.iteration + 1).toString();
        let swapNum = (match.data.swapNum + 1).toString();
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
    
    function playersLabelCell(match, userName) {
        let players = match.results.rankings.map(_ => playerLabel(_, match, userName));
        return '<td>' + players.join('<br />') + '</td>';
    }
    
    function scoresCell(match) {
        if (!match.scores) return '<td style="display:none;"></td>';
        let playerIdOrder = match.results.rankings.map(_ => _.agentId);
        let scores = playerIdOrder.map(agentId => {
            let entry = match.scores.find(_ => _.agentId === agentId);
            if (!entry) return '???';
            if (!entry.max) return entry.score;
            return entry.score + '&nbsp;/&nbsp;' + entry.max;
        });
        return '<td>' + scores.join('<br />') + '</td>';
    }
    
    function playerLabel(player, match, userName) {
        let agent = match.data.agents.find(_ => _.agentId === player.agentId);
        let playerName = player.name;
        if (playerName === userName && player.agentId === -1) return `${playerName} [IDE]`;
        if (agent && agent.rank) return `${playerName} [${agent.rank}]`;
        return playerName;
    }
    
    function nameForAgent(agent) {
        if (!!agent.pseudo) return agent.pseudo;
        if (!!agent.arenaboss) return agent.arenaboss.nickname;
        if (!!agent.codingamer) return agent.codingamer.pseudo;
        return 'Default';
    }
    
    function winnerLabelCell(match, userName) {
        let winners = getWinnersForRankings(match.results.rankings);
        if (winners.length > 1) return '<td>' + chrome.i18n.getMessage('tiedMatch') + '</td>';
        return '<td>' + playerLabel(winners[0], match, userName) + '</td>';
    }
    
    function getWinnersForRankings(rankings) {
        return rankings.filter(_ => _.rank === 1);
    }
    
    function stderrLinkCell() {
        return '<td><button type="button" class="btn btn-link" id="stderrBtn' + g_matchNum + '">' +
            chrome.i18n.getMessage('btnStderr') + '</button></td>';
    }
    
    function addButtonEventHandlers(tbody, match) {
        if (match.results.crash) {
            tbody.on('click', '#crashBtn' + g_matchNum, () => {
                chrome.runtime.sendMessage({
                    action: 'showMatchCrashInfo',
                    crashInfo: match.results.crash
                });
            });
        }
    
        tbody.on('click', '#sendToIdeBtn' + g_matchNum, () => {
            chrome.tabs.sendMessage(g_tabId, {
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
        $('#invalidBtn' + g_matchNum).tooltip({ trigger: 'hover' });
        $('#timeoutBtn' + g_matchNum).tooltip({ trigger: 'hover' });
        $('#sendToIdeBtn' + g_matchNum).tooltip({ trigger: 'hover' });
    }
    
    function findEntryByName(rankings, name) {
        return rankings.find(_ => _.name === name);
    }
    
    function updateSummary(match, results) {
        let myAgentId = getMyAgentId(results, match);
        let matchInfos = getMatchInfosFromResults(results);
        let matchInfo = matchInfos[g_matchNum-1];
    
        let swapNum = matchInfo.swapNum;
        let type = matchInfo.type;
    
        let typeId = type === 'ide'
            ? 'Ide' : (type === 'arena' ? 'Arena' : '');
        let fieldId = typeId + 'Position' + (swapNum+1);
        let winsId = '#wins' + fieldId;
        let lossesId = '#losses' + fieldId;
        let tiesId = '#ties' + fieldId;
        let avgPosId = '#average' + typeId + 'Placement';
        let avgScoreId = '#average' + typeId + 'Score';
    
        let wins = findMatchesOfStatus(matchInfos, swapNum, type, 'w').length;
        let losses = findMatchesOfStatus(matchInfos, swapNum, type, 'l').length;
        let ties = findMatchesOfStatus(matchInfos, swapNum, type, 't').length;
    
        $(winsId).text(wins);
        $(lossesId).text(losses);
        $(tiesId).text(ties);
    
        addSwapSignificantRuns(results, matchInfos);
        addCodeSignificantRuns(results, matchInfos);
    
        let avgPosElement = $(avgPosId);
        if (avgPosElement.is(':visible'))
            avgPosElement.text(calcAveragePlacementInfo(results.matches, myAgentId, type));
    
        let avgScoreElement = $(avgScoreId);
        if (avgScoreElement.is(':visible'))
            avgScoreElement.text(calcAverageScoreInfo(results.matches, myAgentId, type));
    }

    function getMatchInfosFromResults(results) {
        return results.matches.map(match => calcMatchInfo(match, getMyAgentId(results, match)));
    }
    
    function getMyAgentId(results, match) {
        var myRankings = match.results.rankings.filter(_ => _.name === results.userName);
        if (myRankings.length === 0) return -1;
        if (myRankings.length > 1 &&
            myRankings.filter(_ => _.agentId === -1).length > 0) return -1;
        return myRankings[0].agentId;
    }
    
    function calcMatchInfo(match, myAgentId) {
        return {
            iteration: match.data.iteration,
            swapNum: match.data.swapNum,
            type: match.data.type,
            status: calcMatchStatus(match, myAgentId)
        };
    }
    
    function calcMatchStatus(match, myAgentId) {
        let rankings = match.results.rankings;
        let winners = getWinnersForRankings(rankings);
    
        if (winners.length === 1) return winners[0].agentId === myAgentId ? 'w' : 'l';
        return winners.filter(_ => _.agentId === myAgentId).length ? 't' : 'l';
    }
    
    function calcAveragePlacementInfo(matches, myAgentId, type) {
        let placements = matches.filter(_ => _.data.type === type)
            .map(match => {
                let value = match.results.rankings.find(_ => _.agentId === myAgentId).rank;
                let count = match.results.rankings.filter(_ => _.rank == value).length;
                for (let i = 1; i < count; i++) value += value + i;
                return value / count;
            });
        let sum = placements.reduce((a, b) => a + b);
        return (sum / placements.length).toFixed(2);
    }
    
    function calcAverageScoreInfo(matches, myAgentId, type) {
        let isPercent = false;
        let filteredMatches = matches.filter(_ => _.data.type === type);
        let scores = filteredMatches.map(match => 
                match.scores.find(_ => _.agentId === myAgentId).score);
        let pool = filteredMatches.map(match => 
                match.scores.find(_ => _.agentId === myAgentId).max);
        let sum = scores.reduce((a, b) => a + b);
        let total = pool.reduce((a, b) => a + b);
        if (total > 0) return Math.round(sum * 100 / total) + '%';
        return (sum / scores.length).toFixed(2);
    }
    
    function findMatchesOfStatus(matches, swapNum, type, status) {
        return matches.filter(_ => _.swapNum === swapNum  &&
                                   _.type === type &&
                                   _.status === status);
    }
    
    function addSwapSignificantRuns(results, matchInfos) {
        if (!results.swapEnabled) return;
    
        let lastMatch = matchInfos[matchInfos.length-1];
        if (lastMatch.swapNum !== results.numOpponents) return;
        let type = lastMatch.type;
    
        let significantRuns = getListOfRunsWhereStartPositionIsSignificant(matchInfos, type);
        if (significantRuns.length === 0) return;
    
        $(`#${type}SignificantRuns`).show();
        $(`#${type}SignificantRunsVal`).text(significantRuns.join(', '));
    }

    function getListOfRunsWhereStartPositionIsSignificant(matchInfos, type) {
        let maxIteration = matchInfos[matchInfos.length-1].iteration;

        let runs = [];

        for (let i = 0; i <= maxIteration; i++) {
            let filteredInfos = matchInfos.filter(_ => _.iteration == i && _.type == type);
            if (isSignificantMatchSet(filteredInfos)) runs.push((i+1).toString());
        }

        return runs;
    }
    
    function addCodeSignificantRuns(results, matchInfos) {
        if (!results.arenaCodeEnabled) return;
    
        let significantRuns = getListOfRunsWhereCodeVersionIsSignificant(results, matchInfos);
        if (significantRuns.length === 0) return;
    
        $('#codeSignificantRuns').show();
        $('#codeSignificantRunsVal').text(significantRuns.join(', '));
    }
    
    function getListOfRunsWhereCodeVersionIsSignificant(results, matchInfos) {
        let maxIteration = matchInfos[matchInfos.length-1].iteration;
        let maxSwaps = results.swapEnabled ? results.numOpponents : 0;

        let runs = [];

        for (let i = 0; i <= maxIteration; i++) {
            for (let s = 0; s <= maxSwaps; s++) {
                let filteredInfos = matchInfos.filter(_ => _.iteration == i && _.swapNum == s);
                if (!isSignificantMatchSet(filteredInfos)) continue;
                if (results.swapEnabled) {
                    runs.push(`${i+1} (pos=${s+1})`);
                } else {
                    runs.push((i+1).toString());
                }
            }
        }

        return runs;
    }

    function isSignificantMatchSet(matchInfos) {
        return matchInfos
            .reduce((status, _) => status === null
                ? _.status
                : (status === _.status ? status : 'x'), null) === 'x';
    }

    function showBatchButton(results) {
        let buttonDiv = $('#divBatchBtn');
        let button = $('#batchBtn');
        button.html(chrome.i18n.getMessage('btnSaveBatch'));
        button.prop('disabled', false);
    
        buttonDiv.off('click', '#batchBtn');
        buttonDiv.on('click', '#batchBtn', () => {
            chrome.runtime.sendMessage({
                action: 'showBatchData',
                data: {
                    swapEnabled: results.swapEnabled,
                    arenaCodeEnabled: results.arenaCodeEnabled,
                    numOpponents: results.numOpponents,
                    matches: results.matches.map(prepareBatchData)
                }
            });
        });
    }
    
    function prepareBatchData(match) {
        let agents = match.data.agents.map(prepareBatchAgent);
        let data = JSON.parse(JSON.stringify(match.data));
        data.agents = agents;
        return data;
    }
    
    function prepareBatchAgent(agent) {
        if (!!agent.arenaboss) return prepareBatchBoss(agent);
    
        let pseudo = nameForAgent(agent);
        let shrunken = {
            agentId: agent.agentId,
            pseudo: pseudo
        };
    
        if (!!agent.codingamer) {
            shrunken.codingamer = {
                pseudo: pseudo,
                avatar: agent.codingamer.avatar
            };
        } else {
            shrunken.codingamer = null;
        }
    
        if (typeof agent.specialAgent !== 'undefined')
            shrunken.specialAgent = agent.specialAgent;
    
        return shrunken;
    }
    
    function prepareBatchBoss(agent) {
        return {
            agentId: agent.agentId,
            arenaboss: {
                arenabossId: agent.arenaboss.arenabossId,
                nickname: agent.arenaboss.nickname,
    	        league: {
                    divisionIndex: agent.arenaboss.league.divisionIndex,
                    divisionCount: agent.arenaboss.league.divisionCount
                }
            },
            codingamer: null
        };
    }

    return {
        __FOR_TEST_getListOfRunsWhereCodeVersionIsSignificant: getListOfRunsWhereCodeVersionIsSignificant,
        __FOR_TEST_getListOfRunsWhereStartPositionIsSignificant: getListOfRunsWhereStartPositionIsSignificant,
        __FOR_TEST_getMatchInfosFromResults: getMatchInfosFromResults
    };

})();
