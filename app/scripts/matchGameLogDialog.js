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

    function showLogData() {
        let data = [];
        let showLabels = $('#labels').is(':checked');
        let showStdin = $('#stdin').is(':checked');
        let showStderr = $('#stderr').is(':checked');
        let showStdout = $('#stdout').is(':checked');
        let showSummary = $('#summary').is(':checked');
        let agents = g_gameLog.agents;

        for (let t = 0; t < g_gameLog.data.length; t++) {
            let turn = g_gameLog.data[t];
            let stderr = turn.stderr.find(_ => !!_);
            let stdin = getStdinFromStderr(stderr);
            if (showLabels) {
                data.push(`<span class="text-primary"> ** TURN ${t+1}</span>`);
            }
            if (showStdin && !!stdin) {
                data.push(`<span class="text-success">${stdin}</span>`);
            }
            if (showStderr && !!stderr) {
                stderr = stderr.replace(/IN\n[\s\S]*?\/IN\n/g, '').trim();
                data.push(`<span class="text-danger">${stderr}</span>`);
            }
            if (showStdout) {
                for (let a = 0; a < agents.length; a++) {
                    let stdout = turn.stdout[a];
                    if (!stdout) {
                        continue;
                    }
                    if (showLabels) {
                        data.push(`<span class="text-primary"> ** ${agents[a]}:</span>`);
                    }
                    data.push(`<span class="text-warning">${stdout.trim()}</span>`);
                }
            }
            if (showSummary && !!turn.summary) {
                let summary = turn.summary.replace(/\$(\d)/g, (grp, idx) => {
                    return agents[idx];
                }).trim();
                data.push(`<span class="text-info">${summary}</span>`);
            }
        }

        $('#gameLog').html(data.join('\n'));
    }

    function getStdinFromStderr(stderr) {
        if (!stderr) {
            return null;
        }
        let stdin = stderr.match(/IN\n[\s\S]*?\/IN\n/g);
        if (!!stdin) {
            stdin = stdin.map(_ => _.match(/IN\n([\s\S]*)\/IN\n/)[1]).join('');
        }
        return stdin.trim();
    }
});
