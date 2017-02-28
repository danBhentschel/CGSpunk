(function () {
  'use strict';

  describe('parseLog()', function () {

    it('should properly parse STDERR without IN tags (Issue #59)', function () {
      let log = __GhostInTheCellGameLog_1;
      let data = __CGSpunk_matchGameLogDialog.__FOR_TEST_parseLog(log.data, log.agents, {
        showLabels: true,
        showStdin: true,
        showStderr: true,
        showStdout: true,
        showSummary: true
      });

      expect(data.length).toBe(127);
    });

    it('should create labels properly', function () {
      let log = __GhostInTheCellGameLog_1;
      let data = __CGSpunk_matchGameLogDialog.__FOR_TEST_parseLog(log.data, log.agents, {
        showLabels: true,
        showStdin: false,
        showStderr: false,
        showStdout: false,
        showSummary: false
      });

      expect(data.length).toBe(21);
      expect(data[0].class).toBe('primary');
      expect(data[0].lines).toBe('** TURN 1');
      expect(data[1].lines).toBe('** TURN 2');
      expect(data[20].lines).toBe('** TURN 21');
    });

    it('should create stdin properly', function () {
      let log = __GhostInTheCellGameLog_2;
      let data = __CGSpunk_matchGameLogDialog.__FOR_TEST_parseLog(log.data, log.agents, {
        showLabels: false,
        showStdin: true,
        showStderr: false,
        showStdout: false,
        showSummary: false
      });

      expect(data.length).toBe(200);
      expect(data[0].class).toBe('success');
      expect(data[0].lines).toStartWith('15');
      expect(data[1].lines).toStartWith('20');
      expect(data[199].lines).toStartWith('15');
    });

    it('should create stderr properly', function () {
      let log = __GhostInTheCellGameLog_2;
      let data = __CGSpunk_matchGameLogDialog.__FOR_TEST_parseLog(log.data, log.agents, {
        showLabels: false,
        showStdin: false,
        showStderr: true,
        showStdout: false,
        showSummary: false
      });

      expect(data.length).toBe(200);
      expect(data[0].class).toBe('danger');
      expect(data[0].lines).toStartWith('RESCUE:');
      expect(data[1].lines).toStartWith('RESCUE:');
      expect(data[199].lines).toStartWith('RESCUE:');
    });

    it('should create stdout properly', function () {
      let log = __GhostInTheCellGameLog_2;
      let data = __CGSpunk_matchGameLogDialog.__FOR_TEST_parseLog(log.data, log.agents, {
        showLabels: false,
        showStdin: false,
        showStderr: false,
        showStdout: true,
        showSummary: false
      });

      expect(data.length).toBe(400);
      expect(data[0].class).toBe('warning');
      expect(data[0].lines).toStartWith('INC 1');
      expect(data[1].lines).toStartWith('MOVE 2 7 1');
      expect(data[399].lines).toStartWith('WAIT');
    });

    it('should create stdout labels properly', function () {
      let log = __GhostInTheCellGameLog_2;
      let data = __CGSpunk_matchGameLogDialog.__FOR_TEST_parseLog(log.data, log.agents, {
        showLabels: true,
        showStdin: false,
        showStderr: false,
        showStdout: true,
        showSummary: false
      });

      expect(data.length).toBe(1000);
      expect(data[0].class).toBe('primary');
      expect(data[0].lines).toStartWith('** TURN 1');
      expect(data[1].class).toBe('primary');
      expect(data[1].lines).toStartWith('** player_one:');
      expect(data[2].class).toBe('warning');
      expect(data[2].lines).toStartWith('INC 1');
    });

    it('should create summary properly', function () {
      let log = __GhostInTheCellGameLog_2;
      let data = __CGSpunk_matchGameLogDialog.__FOR_TEST_parseLog(log.data, log.agents, {
        showLabels: false,
        showStdin: false,
        showStderr: false,
        showStdout: false,
        showSummary: true
      });

      expect(data.length).toBe(1);
      expect(data[0].class).toBe('info');
      expect(data[0].lines).toContain('Max rounds reached');
    });

  });

})();
