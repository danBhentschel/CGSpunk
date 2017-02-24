(function () {
  'use strict';

  describe('getListOfRunsWhereCodeVersionIsSignificant()', function () {

    it('should indicate runs 1 and 3 for __CodeSignificantRunsData__Results_RunsOneAndThreeSignificant', function () {
      var results = __CodeSignificantRunsData__Results_RunsOneAndThreeSignificant;
      var matchInfos = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getMatchInfosFromResults(results);
      var significantRuns = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getListOfRunsWhereCodeVersionIsSignificant(results, matchInfos);
      expect(significantRuns.join(', ')).toBe('<a href="#r1i">1</a>, <a href="#r3i">3</a>');
    });

    it('should indicate runs 1 (pos=1) and 2 (pos=2) for __CodeSignificantRunsData__Results_RunsOnePosOneAndTwoPosTwoSignificant', function () {
      var results = __CodeSignificantRunsData__Results_RunsOnePosOneAndTwoPosTwoSignificant;
      var matchInfos = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getMatchInfosFromResults(results);
      var significantRuns = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getListOfRunsWhereCodeVersionIsSignificant(results, matchInfos);
      expect(significantRuns.join(', ')).toBe('<a href="#r1ip1">1 (pos=1)</a>, <a href="#r2ip2">2 (pos=2)</a>');
    });

  });

  describe('getListOfRunsWhereStartPositionIsSignificant()', function () {

    it('should indicate IDE run 2 and Arena runs 1 and 3 for __CodeSignificantRunsData__Results_RunsOnePosOneAndTwoPosTwoSignificant', function () {
      var results = __CodeSignificantRunsData__Results_RunsOnePosOneAndTwoPosTwoSignificant;
      var matchInfos = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getMatchInfosFromResults(results);
      var ideSignificantRuns = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getListOfRunsWhereStartPositionIsSignificant(results, matchInfos, 'ide');
      var arenaSignificantRuns = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getListOfRunsWhereStartPositionIsSignificant(results, matchInfos, 'arena');
      expect(ideSignificantRuns.join(', ')).toBe('<a href="#r1ip1">1</a>, <a href="#r2ip1">2</a>');
      expect(arenaSignificantRuns.join(', ')).toBe('');
    });

  });

  describe('getListOfMatchesWithErrors()', function () {

    it('should report correctly for no swap and no arena code', function () {
      var results = __FailedMatchesData_Results_NoSwapNoArena_Runs_2_3_7_8_9_Failed;
      var matchInfos = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getMatchInfosFromResults(results);
      var errorMatches = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getListOfMatchesWithErrors(results, matchInfos);
      expect(errorMatches.join(', ')).toBe('<a href="#r2">2</a>, <a href="#r3">3</a>, <a href="#r7">7</a>, <a href="#r8">8</a>, <a href="#r9">9</a>');
    });

    it('should report correctly for no swap and with arena code', function () {
      var results = __FailedMatchesData_Results_NoSwapWithArena_Runs_1_2_4_Failed;
      var matchInfos = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getMatchInfosFromResults(results);
      var errorMatches = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getListOfMatchesWithErrors(results, matchInfos);
      expect(errorMatches.join(', ')).toBe('<a href="#r1i">1 (IDE)</a>, <a href="#r2i">2 (IDE)</a>, <a href="#r4i">4 (IDE)</a>');
    });

    it('should report correctly for with swap and no arena code', function () {
      var results = __FailedMatchesData_Results_WithSwapNoArena_Runs_1p1_1p2_2p2_4p1_4p2_5p1_5p2_6p1_6p2_Failed;
      var matchInfos = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getMatchInfosFromResults(results);
      var errorMatches = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getListOfMatchesWithErrors(results, matchInfos);
      expect(errorMatches.join(', ')).toBe('<a href="#r1p1">1 (pos=1)</a>, <a href="#r1p2">1 (pos=2)</a>, <a href="#r2p2">2 (pos=2)</a>, <a href="#r4p1">4 (pos=1)</a>, <a href="#r4p2">4 (pos=2)</a>, <a href="#r5p1">5 (pos=1)</a>, <a href="#r5p2">5 (pos=2)</a>, <a href="#r6p1">6 (pos=1)</a>, <a href="#r6p2">6 (pos=2)</a>');
    });

    it('should report correctly for with swap and with arena code', function () {
      var results = __FailedMatchesData_Results_WithSwapWithArena_Runs_1p1_1p2_2p2_3p1_3p2_Failed;
      var matchInfos = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getMatchInfosFromResults(results);
      var errorMatches = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getListOfMatchesWithErrors(results, matchInfos);
      expect(errorMatches.join(', ')).toBe('<a href="#r1ip1">1 (IDE, pos=1)</a>, <a href="#r1ip2">1 (IDE, pos=2)</a>, <a href="#r2ip2">2 (IDE, pos=2)</a>, <a href="#r3ip1">3 (IDE, pos=1)</a>, <a href="#r3ip2">3 (IDE, pos=2)</a>');
    });

  });

})();
