var MatchGenerator =
(function() {
    'use strict';

    var m_context = {};

    function addMatchesToParams(runData, params) {
        if (!!params.matches && params.matches.length > 0) return params;

        setupInitialContext(runData, params);

        params.matches = Array.from(new Array(params.iterations), (v,i) => i)
            .reduce((matches, i) => addMatchesForIteration(matches, i), []);

        return params;
    }

    function setupInitialContext(runData, params) {
        m_context = {
            currentPlayers: runData.currentPlayers.slice(0),
            myAgents: runData.myAgents,
            candidateAgents: !!runData.candidateAgents ? runData.candidateAgents.slice(0) : [],
            numOpponents: params.numOpponents,
            arenaCodeEnabled: params.arenaCodeEnabled,
            swapEnabled: params.swapEnabled
        };

        if (params.opponentSelectionType === 'current') {
            m_context.current = true;
            m_context.numOpponents = Math.max(1, runData.currentPlayers.length-1);
        }
    }

    function addMatchesForIteration(matches, iteration) {
        m_context.opponents = m_context.current
            ? getCurrentOpponents()
            : getRandomOpponents(m_context.numOpponents);

        if (m_context.opponents.length === 0 && m_context.currentPlayers.length === m_context.numOpponents+1) {
            m_context.opponents = m_context.currentPlayers.slice(0);
        }

        matches = addFirstSetOfMatches(matches, iteration);

        if (!m_context.arenaCodeEnabled) return matches;
        if (m_context.current && m_context.opponents.length === m_context.numOpponents+1) return matches;

        return addSecondSetOfMatches(matches, iteration);
    }

    function addFirstSetOfMatches(matches, iteration) {
        return addSetOfMatches(matches, iteration, true, 'ide');
    }

    function addSecondSetOfMatches(matches, iteration) {
        return addSetOfMatches(matches, iteration, false, 'arena');
    }

    function addSetOfMatches(matches, iteration, initialAutoGameOptions, agentType) {
        let players = addMyAgentIfNeeded(m_context.opponents.slice(0), agentType);
        let swapNum = 0;
        let autoGameOptions = initialAutoGameOptions;
        let firstPlayer = players[0].agentId;
        do {
            matches.push(newMatch(players, autoGameOptions, agentType, swapNum, iteration));
            autoGameOptions = false;
            players = players.slice(0);
            players.unshift(players.pop());
            swapNum++;
        } while (m_context.swapEnabled &&
                 players[0].agentId != firstPlayer);
        
        return matches;
    }

    function addMyAgentIfNeeded(players, agentType) {
        if (m_context.current && players.length > m_context.numOpponents) return players;
        players.splice(0, 0, m_context.myAgents[agentType]);
        return players;
    }

    function getCurrentOpponents() {
        let me = m_context.myAgents.ide.pseudo;
        return m_context.currentPlayers.filter(player => isNotMe(player, me));
    }

    function isNotMe(player, me) {
        if (player.pseudo === me) return false;
        if (!player.codingamer) return true;
        return player.codingamer.pseudo !== me;
    }

    function getRandomOpponents(num) {
        let opponents = [];
        let candidates = m_context.candidateAgents.slice(0);
        for (let i = 0; i < num; i++) {
            if (candidates.length === 0) break;
            var opponentNum = getRandomOpponentNum(candidates);
            opponents.push(candidates[opponentNum]);
            candidates.splice(opponentNum, 1);
        }

        return opponents;
    }

    var getRandomOpponentNum = defaultGetRandomOpponentNumFunc;

    function defaultGetRandomOpponentNumFunc(candidates) {
        return Math.floor(Math.random() * candidates.length);
    }

    function __FOR_TEST_setRandomOpponentNumFunc(theFunc) {
        getRandomOpponentNum = theFunc;
    }

    function __FOR_TEST_resetRandomOpponentNumFunc() {
        getRandomOpponentNum = defaultGetRandomOpponentNumFunc;
    }

    function newMatch(players, autoGameOptions, type, swapNum, iteration) {
        return {
            iteration: iteration,
            gameOptions: autoGameOptions ? '**auto' : '**manual',
            agents: players,
            type: type,
            swapNum: swapNum
        };
    }

    return new function() {
        let generator = this;

        generator.addMatchesToParams = addMatchesToParams;


        generator.__FOR_TEST_setRandomOpponentNumFunc = __FOR_TEST_setRandomOpponentNumFunc;
        generator.__FOR_TEST_resetRandomOpponentNumFunc = __FOR_TEST_resetRandomOpponentNumFunc;
    };
})();
