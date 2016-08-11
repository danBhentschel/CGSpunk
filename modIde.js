(function() {
    'use strict';
    
    var g_iterations = 100;
    var g_stopPlay100;

    chrome.storage.sync.get({ iterations: 100 }, (items) => {
        g_iterations = items.iterations;
    });

    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName !== 'sync') return;
        if (changes.hasOwnProperty('iterations')) {
            g_iterations = changes['iterations'].newValue;
            $('#pOnePlay100Button').html('PLAY_' + g_iterations);
        }
    });
    
    $(document).on('DOMNodeInserted', checkForAgentPanel);
        
    function checkForAgentPanel(event) {
        if ($(event.target).is('.cg-ide-agents-management') && 
            $('.cg-ide-agents-management > .scroll-panel').length) {
            $(document).off('DOMNodeInserted', checkForAgentPanel);
            createSwapButton();
            createPlay100Button();
            createStopButton();
        }
    }
    
    function createSwapButton() {
        var panel = $('.cg-ide-agents-management > .scroll-panel');
        var swapButton = document.createElement('BUTTON');
        swapButton.innerHTML = 'SWAP';
        swapButton.setAttribute('id', 'pOneSwapButton');
        swapButton.style.padding = '5px 5px 5px 5px';
        panel.append(swapButton);
        console.log('P_ONE: Create SWAP button');
        
        $('#pOneSwapButton').click(swapClicked);
    }
    
    function swapClicked() {
        console.log('P_ONE: SWAP clicked');

        var agentNames = getAgentNames();
        deleteAgents(agentNames);
        addAgents(agentNames);
    }
    
    function getAgentNames() {
        var agentNames = [];
        
        $('.agent').each(function(index) {
            agentNames[index] = $(this).find('.nickname').text();
        });
        
        return agentNames;
    }
    
    function deleteAgents(agentNames) {
        $('.delete-button').each(function(index) {
            console.log('P_ONE: Click DELETE for ' + agentNames[index]);
            $(this).click();
        });
    }
    
    function addAgents(agentNames) {
        addAgent($('.add-player-square'), agentNames, 0);
    }
    
    function addAgent(buttons, agentNames, position) {
        if (position >= agentNames.length) return;
        
        var nameIndex = (position + 1) % agentNames.length;
        var wantedAgentName = agentNames[nameIndex];
        console.log('P_ONE: Click ADD for ' + wantedAgentName + ' in position ' + position);

        buttons.eq(position).click();
        
        setTimeout(() => { checkForPlayerSelector(buttons, agentNames, wantedAgentName, position); }, 500);
    }
    
    function checkForPlayerSelector(buttons, agentNames, wantedAgentName, position) {
        var searchBox = $('.field');
        if (searchBox.length && searchBox.closest('.searchfield').length) {
            selectAgentToAdd(buttons, agentNames, wantedAgentName, position);
        } else {
            setTimeout(() => { checkForPlayerSelector(buttons, agentNames, wantedAgentName, position); }, 500);
        }
    }
    function selectAgentToAdd(buttons, agentNames, wantedAgentName, position) {
        searchForAgent(wantedAgentName);
        setTimeout(() => { addSpecificAgent(buttons, agentNames, wantedAgentName, position); }, 200);
    }
    
    function addSpecificAgent(buttons, agentNames, wantedAgentName, position) {
        var found = false;

        $('.player-add-card').each(function() {
            var agentCardName = $(this).find('.agent-card-nickname').text();
            if (agentCardName == wantedAgentName) {
                console.log('P_ONE: Found ' + agentCardName);
                $(this).find('.add-agent-button').click();
                found = true;
                return false;
            }
        });
        
        if (found) {
            addAgent(buttons, agentNames, position + 1);
        } else {
            setTimeout(() => { addSpecificAgent(buttons, agentNames, wantedAgentName, position); }, 200);
        }
    }
    
    function searchForAgent(agentName) {
        var searchBox = $('.field');
        console.log('P_ONE: Search for ' + agentName);
        searchBox.val(agentName);
        searchBox[0].focus();
        pressEnter(searchBox[0]);
    }
    
    function pressEnter(element) {
        pressKey(13, element);
    }
    
    function pressKey(k, element) {
        var oEvent = document.createEvent('KeyboardEvent');

        // Chromium Hack
        Object.defineProperty(oEvent, 'keyCode', {
            get : function() {
                return this.keyCodeVal;
            }
        });
        Object.defineProperty(oEvent, 'which', {
            get : function() {
                return this.keyCodeVal;
            }
        });

        if (oEvent.initKeyboardEvent) {
            oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, k, k);
        } else {
            oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, k, 0);
        }

        oEvent.keyCodeVal = k;

        if (oEvent.keyCode !== k) {
            alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
        }

        element.dispatchEvent(oEvent);
    }
    
    function createPlay100Button() {
        var panel = $('.cg-ide-agents-management > .scroll-panel');
        var play100Button = document.createElement('BUTTON');
        play100Button.innerHTML = 'PLAY_' + g_iterations;
        play100Button.setAttribute('id', 'pOnePlay100Button');
        play100Button.style.padding = '5px 5px 5px 5px';
        panel.append(play100Button);
        console.log('P_ONE: Create PLAY_100 button');
        
        $('#pOnePlay100Button').click(play100Clicked);
    }
    
    function play100Clicked() {
        console.log('P_ONE: PLAY_100 clicked');
        g_stopPlay100 = false;
        $('#pOneStopButton').show();
        $('#pOnePlay100Button').hide();
        startPlay(1, { names: [], record: {}, ties: 0 });
    }
    
    function startPlay(iteration, results) {
        if (iteration > g_iterations || g_stopPlay100) {
            $('#pOneStopButton').hide();
            $('#pOnePlay100Button').show();
            return;
        }
        
        console.log('Play ' + pad(iteration));
        $('.play').click();
        setTimeout(() => { checkForResult(iteration, results); }, 200);
    }
    
    function pad(num) {
        var s = "00" + num;
        return s.substr(s.length-3);
    }
    
    function checkForResult(iteration, results) {
        var rankedNames = $('.cg-ide-mini-leaderboard').find('.nickname');
        if ($('.play').is(':disabled') || rankedNames.length === 0) {
            setTimeout(() => { checkForResult(iteration, results); }, 200);
        } else {
            results = recordResults(rankedNames, results);
            logResults(results);
            startPlay(iteration + 1, results);
        }
    }

    function recordResults(rankedNames, results) {
        var rankings = [];
        rankedNames.each(function(index) {
            var name = $(this).text();
            if (!results.record.hasOwnProperty(name)) {
                results.names.push(name);
                results.record[name] = 0;
            }
            var rankNum = getRankNum($(this));
            if (!rankings[rankNum]) rankings[rankNum] = [];
            rankings[rankNum].push(name);
        });

        if (rankings[1].length == 1) {
            results.record[rankings[1][0]]++;
        } else {
            results.ties++;
        }

        return results;
    }

    function getRankNum(rankNameObj) {
        return parseInt(rankNameObj.closest('.leaderboard-item').find('.rank-value').eq(0).text(), 10);
    }
    
    function logResults(results) {
        var report = '';
        for (var i = 0; i < results.names.length; i++) {
            var name = results.names[i];
            report += name + ': ' + results.record[name] + '  ';
        }

        report += 'ties: ' + results.ties;

        console.log(report);
    }
    
    function createStopButton() {
        var panel = $('.cg-ide-agents-management > .scroll-panel');
        var stopButton = document.createElement('BUTTON');
        stopButton.innerHTML = 'STOP';
        stopButton.setAttribute('id', 'pOneStopButton');
        stopButton.style.padding = '5px 5px 5px 5px';
        panel.append(stopButton);
        console.log('P_ONE: Create STOP button');
        
        $('#pOneStopButton').click(stopClicked);
        $('#pOneStopButton').hide();
    }

    function stopClicked() {
        g_stopPlay100 = true;
        console.log('P_ONE: STOP requested. Stopping at next opportunity');
    }
})();
