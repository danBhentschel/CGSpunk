(function () {
  'use strict';

  describe('getListOfRunsWhereCodeVersionIsSignificant()', function () {

    it('should indicate runs 1 and 3 for __CodeSignificantRunsData__Results_RunsOneAndThreeSignificant', function () {
      var results = __CodeSignificantRunsData__Results_RunsOneAndThreeSignificant;
      var matchInfos = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getMatchInfosFromResults(results);
      var significantRuns = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getListOfRunsWhereCodeVersionIsSignificant(results, matchInfos);
      expect(significantRuns.join(', ')).toBe('1, 3');
    });

    it('should indicate runs 1 (pos=1) and 2 (pos=2) for __CodeSignificantRunsData__Results_RunsOnePosOneAndTwoPosTwoSignificant', function () {
      var results = __CodeSignificantRunsData__Results_RunsOnePosOneAndTwoPosTwoSignificant;
      var matchInfos = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getMatchInfosFromResults(results);
      var significantRuns = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getListOfRunsWhereCodeVersionIsSignificant(results, matchInfos);
      expect(significantRuns.join(', ')).toBe('1 (pos=1), 2 (pos=2)');
    });

  });

  describe('getListOfRunsWhereStartPositionIsSignificant()', function () {

    it('should indicate IDE run 2 and Arena runs 1 and 3 for __CodeSignificantRunsData__Results_RunsOnePosOneAndTwoPosTwoSignificant', function () {
      var results = __CodeSignificantRunsData__Results_RunsOnePosOneAndTwoPosTwoSignificant;
      var matchInfos = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getMatchInfosFromResults(results);
      var ideSignificantRuns = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getListOfRunsWhereStartPositionIsSignificant(matchInfos, 'ide');
      var arenaSignificantRuns = __CGSpunk_batchRunResultsDialog.__FOR_TEST_getListOfRunsWhereStartPositionIsSignificant(matchInfos, 'arena');
      expect(ideSignificantRuns.join(', ')).toBe('1, 2');
      expect(arenaSignificantRuns.join(', ')).toBe('');
    });

  });

})();
