var __CGSpunk_matchGameLogDialog =
(function() {
    'use strict';

    var g_gameLog;

    $(document).ready(() => {
        chrome.runtime.sendMessage({ action: 'getLastGameLog' }, gameLog => {
            g_gameLog = gameLog;
            showLogData();
            $('#stdin').tooltip({ trigger: 'hover' });
        });

        $('#selections').on('change', ':checkbox', function() {
            showLogData();
        });
    });

    function showLogData() {
        let agents = g_gameLog.agents;

        let data = parseLog(g_gameLog.data, g_gameLog.agents, {
            showLabels: $('#labels').is(':checked'),
            showStdin: $('#stdin').is(':checked'),
            showStderr: $('#stderr').is(':checked'),
            showStdout: $('#stdout').is(':checked'),
            showSummary: $('#summary').is(':checked')
        });

        $('#gameLog').html(data.map(entry => {
            return `<span class="text-${entry.class}">${entry.lines}</span>`;
        }).join('\n'));
    }

    function parseLog(log, agents, options) {
        let data = [];

        for (let t = 0; t < log.length; t++) {
            let turn = log[t];

            if (options.showLabels) {
                data = addTurnNumberData(data, t+1);
            }

            let stderr = turn.stderr.find(_ => !!_);
            if (options.showStdin) {
                data = addStdinData(data, stderr);
            }

            if (options.showStderr) {
                data = addStderrData(data, stderr);
            }

            if (options.showStdout) {
                data = addStdoutData(data, agents, turn.stdout, options.showLabels);
            }
            if (options.showSummary) {
                data = addSummaryData(data, turn.summary);
            }
        }

        return data;
    }

    function addTurnNumberData(data, num) {
        data.push({
            class: 'primary',
            lines: `** TURN ${num}`
        });
        return data;
    }

    function addStdinData(data, stderr) {
        let stdin = getStdinFromStderr(stderr);

        if (!stdin) {
            return data;
        }

        data.push({
            class: 'success',
            lines: stdin
        });

        return data;
    }

    function getStdinFromStderr(stderr) {
        if (!stderr) {
            return null;
        }
        let stdin = stderr.match(/IN\n[\s\S]*?\/IN\n/g);
        if (!!stdin) {
            stdin = stdin.map(_ => _.match(/IN\n([\s\S]*)\/IN\n/)[1]).join('').trim();
        }
        return stdin;
    }

    function addStderrData(data, stderr) {
        if (!stderr) {
            return data;
        }

        let onlyStderr = stderr.replace(/IN\n[\s\S]*?\/IN\n/g, '').trim();
        data.push({
            class: 'danger',
            lines: onlyStderr
        });

        return data;
    }

    function addStdoutData(data, agents, stdout, showLabels) {
        for (let a = 0; a < agents.length; a++) {
            data = addStdoutDataForAgent(data, agents[a], stdout[a], showLabels);
        }

        return data;
    }

    function addStdoutDataForAgent(data, agent, lines, showLabels) {
        if (!lines) {
            return data;
        }

        if (showLabels) {
            data = addStdoutAgentLabel(data, agent);
        }

        data.push({
            class: 'warning',
            lines: lines.trim()
        });

        return data;
    }

    function addStdoutAgentLabel(data, agent) {
        data.push({
            class: 'primary',
            lines: `** ${agent}:`
        });
        return data;
    }

    function addSummaryData(data, summary) {
        if (!summary) {
            return data;
        }

        let formattedSummary = summary.replace(/\$(\d)/g, (grp, idx) => {
            return agents[idx];
        }).trim();

        data.push({
            class: 'info',
            lines: formattedSummary
        });

        return data;
    }

    return {
        __FOR_TEST_parseLog: parseLog
    };
})();
