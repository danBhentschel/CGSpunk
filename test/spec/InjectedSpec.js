(function () {
  'use strict';

  describe('getMyAgentFromGameManager()', function () {

    it('should return my arena agent if against other opponent', function () {
      var gameManager = {
        agents: [
          {'arenaboss':null,'index':0,'position':1,'userId':552776,'name':'player_one','score':1,'agentId':928929,'gameScore':1,'avatar':10125077229939,'color':'#ff8f16','rank':2},
          {'arenaboss':null,'index':1,'position':0,'userId':1606588,'name':'inoryy','score':2,'agentId':971761,'gameScore':2,'avatar':10240616948374,'color':'#ff1d5c','rank':1}
        ]
      };
      var agent = __CGSpunk_Injected.__FOR_TEST_getMyAgentFromGameManager(gameManager, 'player_one');
      expect(agent.name).toBe('player_one');
    });

    it('should return my arena agent if against other opponent (reverse)', function () {
      var gameManager = {
        agents: [
          {'arenaboss':null,'index':0,'position':0,'userId':1606588,'name':'inoryy','score':2,'agentId':971761,'gameScore':2,'avatar':10240616948374,'color':'#ff1d5c','rank':1},
          {'arenaboss':null,'index':1,'position':1,'userId':552776,'name':'player_one','score':1,'agentId':928929,'gameScore':1,'avatar':10125077229939,'color':'#ff8f16','rank':2}
        ]
      };
      var agent = __CGSpunk_Injected.__FOR_TEST_getMyAgentFromGameManager(gameManager, 'player_one');
      expect(agent.name).toBe('player_one');
    });

    it('should return my arena agent if against itself', function () {
      var gameManager = {
        agents: [
          {'arenaboss':null,'index':0,'position':1,'userId':552776,'name':'player_one','score':1,'agentId':928929,'gameScore':1,'avatar':10125077229939,'color':'#ff8f16','rank':2},
          {'arenaboss':null,'index':1,'position':0,'userId':552776,'name':'player_one','score':2,'agentId':928929,'gameScore':2,'avatar':10125077229939,'color':'#ff1d5c','rank':1}
        ]
      };
      var agent = __CGSpunk_Injected.__FOR_TEST_getMyAgentFromGameManager(gameManager, 'player_one');
      expect(agent.name).toBe('player_one');
    });

    it('should return my IDE agent if against other opponent', function () {
      var gameManager = {
        agents: [
          {'arenaboss':null,'index':0,'position':1,'userId':552776,'name':'player_one','score':0,'agentId':-1,'gameScore':0,'avatar':10125077229939,'color':'#ff8f16','rank':2},
          {'arenaboss':null,'index':1,'position':0,'userId':351062,'name':'Neumann','score':2,'agentId':958004,'gameScore':2,'avatar':10183930628707,'color':'#ff1d5c','rank':1}
        ]
      };
      var agent = __CGSpunk_Injected.__FOR_TEST_getMyAgentFromGameManager(gameManager, 'player_one');
      expect(agent.name).toBe('player_one');
    });

    it('should return my IDE agent if against other opponent (reverse)', function () {
      var gameManager = {
        agents: [
          {'arenaboss':null,'index':0,'position':0,'userId':351062,'name':'Neumann','score':2,'agentId':958004,'gameScore':2,'avatar':10183930628707,'color':'#ff1d5c','rank':1},
          {'arenaboss':null,'index':1,'position':1,'userId':552776,'name':'player_one','score':0,'agentId':-1,'gameScore':0,'avatar':10125077229939,'color':'#ff8f16','rank':2}
        ]
      };
      var agent = __CGSpunk_Injected.__FOR_TEST_getMyAgentFromGameManager(gameManager, 'player_one');
      expect(agent.name).toBe('player_one');
    });

    it('should return my IDE agent if against itself', function () {
      var gameManager = {
        agents: [
          {'arenaboss':null,'index':0,'position':1,'userId':552776,'name':'player_one','score':0,'agentId':-1,'gameScore':1,'avatar':10125077229939,'color':'#ff8f16','rank':2},
          {'arenaboss':null,'index':1,'position':1,'userId':552776,'name':'player_one','score':0,'agentId':-1,'gameScore':2,'avatar':10125077229939,'color':'#ff8f16','rank':2}
        ]
      };
      var agent = __CGSpunk_Injected.__FOR_TEST_getMyAgentFromGameManager(gameManager, 'player_one');
      expect(agent.name).toBe('player_one');
    });

    it('should return my IDE agent if against my arena agent', function () {
      var gameManager = {
        agents: [
          {'arenaboss':null,'index':0,'position':0,'userId':552776,'name':'player_one','score':2,'agentId':-1,'gameScore':2,'avatar':10125077229939,'color':'#ff8f16','rank':1},
          {'arenaboss':null,'index':1,'position':1,'userId':552776,'name':'player_one','score':0,'agentId':928929,'gameScore':0,'avatar':10125077229939,'color':'#ff1d5c','rank':2}
        ]
      };
      var agent = __CGSpunk_Injected.__FOR_TEST_getMyAgentFromGameManager(gameManager, 'player_one');
      expect(agent.name).toBe('player_one');
    });

    it('should return null if my agent not present', function () {
      var gameManager = {
        agents: [
          {'arenaboss':null,'index':0,'position':1,'userId':832306,'name':'pb4','score':1,'agentId':917445,'gameScore':1,'avatar':10135289026547,'color':'#ff8f16','rank':2},
          {'arenaboss':null,'index':1,'position':0,'userId':1106450,'name':'RiSuS','score':2,'agentId':949875,'gameScore':2,'avatar':10294521703288,'color':'#ff1d5c','rank':1}
        ]
      };
      var agent = __CGSpunk_Injected.__FOR_TEST_getMyAgentFromGameManager(gameManager, 'player_one');
      expect(agent).toBe(null);
    });

  });

  describe('getMyStateFromGameManager()', function () {

    it('should return "normal" if game ended normally', function () {
      var gameManager = {
        agents: [
          {'arenaboss':null,'index':0,'position':1,'userId':552776,'name':'player_one','score':0,'agentId':-1,'gameScore':0,'avatar':10125077229939,'color':'#ff8f16','rank':2},
          {'arenaboss':null,'index':1,'position':0,'userId':351062,'name':'Neumann','score':2,'agentId':958004,'gameScore':2,'avatar':10183930628707,'color':'#ff1d5c','rank':1}
        ],
        frames: __GameEndStateData__Frames_EndsNormally
      };
      var state = __CGSpunk_Injected.__FOR_TEST_getMyStateFromGameManager(gameManager, 'player_one');
      expect(state).toBe('normal');
    });

    it('should return "invalid" if bot output invalid results', function () {
      var gameManager = {
        agents: [
          {'arenaboss':null,'index':0,'position':1,'userId':552776,'name':'player_one','score':0,'agentId':-1,'gameScore':0,'avatar':10125077229939,'color':'#ff8f16','rank':2},
          {'arenaboss':null,'index':1,'position':0,'userId':351062,'name':'Neumann','score':2,'agentId':958004,'gameScore':2,'avatar':10183930628707,'color':'#ff1d5c','rank':1}
        ],
        frames: __GameEndStateData__Frames_InvalidOutput
      };
      var state = __CGSpunk_Injected.__FOR_TEST_getMyStateFromGameManager(gameManager, 'player_one');
      expect(state).toBe('invalid');
    });

    it('should return "timeout" if bot times out', function () {
      var gameManager = {
        agents: [
          {'arenaboss':null,'index':0,'position':1,'userId':552776,'name':'player_one','score':0,'agentId':-1,'gameScore':0,'avatar':10125077229939,'color':'#ff8f16','rank':2},
          {'arenaboss':null,'index':1,'position':0,'userId':351062,'name':'Neumann','score':2,'agentId':958004,'gameScore':2,'avatar':10183930628707,'color':'#ff1d5c','rank':1}
        ],
        frames: __GameEndStateData__Frames_Timeout
      };
      var state = __CGSpunk_Injected.__FOR_TEST_getMyStateFromGameManager(gameManager, 'player_one');
      expect(state).toBe('timeout');
    });

    it('should return "normal" if my agent not present', function () {
      var gameManager = {
        agents: [
          {'arenaboss':null,'index':0,'position':1,'userId':832306,'name':'pb4','score':1,'agentId':917445,'gameScore':1,'avatar':10135289026547,'color':'#ff8f16','rank':2},
          {'arenaboss':null,'index':1,'position':0,'userId':1106450,'name':'RiSuS','score':2,'agentId':949875,'gameScore':2,'avatar':10294521703288,'color':'#ff1d5c','rank':1}
        ],
        frames: __GameEndStateData__Frames_EndsNormally
      };
      var state = __CGSpunk_Injected.__FOR_TEST_getMyStateFromGameManager(gameManager, 'player_one');
      expect(state).toBe('normal');
    });

  });

  describe('getGameHistoryFromGameManager()', function () {
    var gameManager;

    beforeEach(function () {
      gameManager = {
        agents: __CodeBustersAgents_1,
        frames: __CodeBustersFrames_1
      };
    });

    it('should have 199 turns of data', function () {
      var history = __CGSpunk_Injected.__FOR_TEST_getGameHistoryFromGameManager(gameManager);
      expect(history.data.length).toBe(199);
    });

    it('should have summary info for each frame', function () {
      var history = __CGSpunk_Injected.__FOR_TEST_getGameHistoryFromGameManager(gameManager);
      expect(history.data.filter(_ => !!_.summary).length).toBe(199);
    });

    it('should have 2 stdout entries for each frame', function () {
      var history = __CGSpunk_Injected.__FOR_TEST_getGameHistoryFromGameManager(gameManager);
      expect([].concat.apply([], history.data.map(_ => _.stdout)).filter(_ => !!_).length).toBe(398);
    });

    it('should have 1 stderr entry for each frame', function () {
      var history = __CGSpunk_Injected.__FOR_TEST_getGameHistoryFromGameManager(gameManager);
      expect([].concat.apply([], history.data.map(_ => _.stderr)).filter(_ => !!_).length).toBe(199);
    });

  });

})();
