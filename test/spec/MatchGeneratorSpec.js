(function () {
  'use strict';

  describe('addMatchesToParams()', function () {
    var params, runData = null;
    var arenaAgent = { agentId: 0, pseudo: 'Me', codingamer: { pseudo: 'MeArena', avatar: 0 } };
    var ideAgent = { agentId: -1, pseudo: 'Me', codingamer: { pseudo: 'Me', avatar: 0 } };
    var opponent1 = { agentId: 100, pseudo: 'p1', codingamer: { pseudo: 'p1', avatar: 100 } };
    var opponent2 = { agentId: 101, pseudo: 'p2', codingamer: { pseudo: 'p2', avatar: 101 } };
    var opponent3 = { agentId: 102, pseudo: 'p3', codingamer: { pseudo: 'p3', avatar: 102 } };
    var opponent4 = { agentId: 103, pseudo: 'p4', codingamer: { pseudo: 'p4', avatar: 103 } };
    var opponent5 = { agentId: 104, pseudo: 'p5', codingamer: { pseudo: 'p5', avatar: 104 } };
    var opponent6 = { agentId: 105, pseudo: 'p6', codingamer: { pseudo: 'p6', avatar: 105 } };
    var opponent7 = { agentId: 106, pseudo: 'p7', codingamer: { pseudo: 'p7', avatar: 106 } };
    var opponent8 = { agentId: 107, pseudo: 'p8', codingamer: { pseudo: 'p8', avatar: 107 } };
    var opponent9 = { agentId: 108, pseudo: 'p9', codingamer: { pseudo: 'p9', avatar: 108 } };
    var opponent10 = { agentId: 109, pseudo: 'p10', codingamer: { pseudo: 'p10', avatar: 109 } };

    beforeEach(function() {
      params = {};
      runData = { myAgents: { arena: arenaAgent, ide: ideAgent } };
    });

    describe('with "Use the current opponent(s)" selected', function () {
      beforeEach(function() {
        params.opponentSelectionType = 'current';
      });

      describe('with all non-me players selected in IDE', function () {
        beforeEach(function() {
          runData.currentPlayers = [ opponent1, opponent2, opponent3, opponent4 ];
        });

        describe('with "Perform each ... swapped" unselected', function () {
          beforeEach(function() {
            params.swapEnabled = false;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(opponent1.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent1.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(opponent1.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent1.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent3.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(opponent1.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent1.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent4.agentId);
              });
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(opponent1.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent1.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
              });
            });
          });
        });

        describe('with "Perform each ... swapped" selected', function () {
          beforeEach(function() {
            params.swapEnabled = true;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should swap opponents in even matches', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(opponent1.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent1.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent1.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent1.agentId);
              });
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should swap opponents in even matches', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(opponent1.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent1.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent1.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent1.agentId);
              });
            });
          });
        });
      });




      describe('with only one non-me player selected in IDE', function () {
        beforeEach(function() {
          runData.currentPlayers = [ opponent1 ];
        });

        describe('with "Perform each ... swapped" unselected', function () {
          beforeEach(function() {
            params.swapEnabled = false;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            it('should create a single match for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(1);
            });

            it('should create two matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should keep both opponents as selected for each match', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent1.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(opponent1.agentId);
            });
          });
        });

        describe('with "Perform each ... swapped" selected', function () {
          beforeEach(function() {
            params.swapEnabled = true;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            it('should create two matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should create four matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should swap opponents in even matches', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent1.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(opponent1.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(opponent1.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(opponent1.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(ideAgent.agentId);
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            it('should create four matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should create eight matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(8);
            });

            it('should swap opponents in even matches', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent1.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(opponent1.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(opponent1.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(opponent1.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[4].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[4].agents[1].agentId).toBe(opponent1.agentId);
              expect(params.matches[5].agents[0].agentId).toBe(opponent1.agentId);
              expect(params.matches[5].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[6].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[6].agents[1].agentId).toBe(opponent1.agentId);
              expect(params.matches[7].agents[0].agentId).toBe(opponent1.agentId);
              expect(params.matches[7].agents[1].agentId).toBe(arenaAgent.agentId);
            });
          });
        });
      });



      describe('with my IDE agent and my arena agent selected in IDE', function () {
        beforeEach(function() {
          runData.currentPlayers = [ ideAgent, arenaAgent ];
        });

        describe('with "Perform each ... swapped" unselected', function () {
          beforeEach(function() {
            params.swapEnabled = false;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            it('should create a single match for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(1);
            });

            it('should create two matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should keep both opponents as selected for each match', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(arenaAgent.agentId);
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            it('should create a single match for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(1);
            });

            it('should create two matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should keep both opponents as selected for each match', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(arenaAgent.agentId);
            });
          });
        });

        describe('with "Perform each ... swapped" selected', function () {
          beforeEach(function() {
            params.swapEnabled = true;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            it('should create two matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should create four matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should swap opponents in even matches', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(ideAgent.agentId);
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            it('should create two matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should create four matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should swap opponents in even matches', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(ideAgent.agentId);
            });
          });
        });
      });



      describe('with my IDE agent and opponents selected in IDE', function () {
        beforeEach(function() {
          runData.currentPlayers = [ ideAgent, opponent2, opponent3, opponent4 ];
        });

        describe('with "Perform each ... swapped" unselected', function () {
          beforeEach(function() {
            params.swapEnabled = false;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent3.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent4.agentId);
              });
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should replace IDE with arena for even matches', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should replace IDE with arena for even matches', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent3.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should replace IDE with arena for even matches', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent4.agentId);
              });
            });
          });
        });

        describe('with "Perform each ... swapped" selected', function () {
          beforeEach(function() {
            params.swapEnabled = true;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should swap opponents in even matches', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(ideAgent.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create three matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(3);
              });

              it('should create six matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(6);
              });

              it('should swap opponents in matches', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[5].agents[2].agentId).toBe(ideAgent.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create four matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should create eight matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(8);
              });

              it('should swap opponents in matches', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent3.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[3].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[3].agents[3].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[4].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[4].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[5].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[5].agents[3].agentId).toBe(opponent3.agentId);
                expect(params.matches[6].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[6].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[6].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[6].agents[3].agentId).toBe(opponent2.agentId);
                expect(params.matches[7].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[7].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[7].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[7].agents[3].agentId).toBe(ideAgent.agentId);
              });
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create four matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should create eight matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(8);
              });

              it('should swap opponents and switch arena for ide', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(arenaAgent.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create six matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(6);
              });

              it('should create twelve matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(12);
              });

              it('should swap opponents and switch arena for ide', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[4].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[5].agents[2].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[6].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[6].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[6].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[7].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[7].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[7].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[8].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[8].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[8].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[9].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[9].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[9].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[10].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[10].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[10].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[11].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[11].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[11].agents[2].agentId).toBe(arenaAgent.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create eight matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(8);
              });

              it('should create sixteen matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(16);
              });

              it('should swap opponents and switch arena for ide', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent3.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[3].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[3].agents[3].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[4].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[4].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[5].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[5].agents[3].agentId).toBe(opponent3.agentId);
                expect(params.matches[6].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[6].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[6].agents[2].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[6].agents[3].agentId).toBe(opponent2.agentId);
                expect(params.matches[7].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[7].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[7].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[7].agents[3].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[8].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[8].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[8].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[8].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[9].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[9].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[9].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[9].agents[3].agentId).toBe(opponent3.agentId);
                expect(params.matches[10].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[10].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[10].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[10].agents[3].agentId).toBe(opponent2.agentId);
                expect(params.matches[11].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[11].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[11].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[11].agents[3].agentId).toBe(ideAgent.agentId);
                expect(params.matches[12].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[12].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[12].agents[2].agentId).toBe(opponent3.agentId);
                expect(params.matches[12].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[13].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[13].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[13].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[13].agents[3].agentId).toBe(opponent3.agentId);
                expect(params.matches[14].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[14].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[14].agents[2].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[14].agents[3].agentId).toBe(opponent2.agentId);
                expect(params.matches[15].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[15].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[15].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[15].agents[3].agentId).toBe(arenaAgent.agentId);
              });
            });
          });
        });
      });



      describe('with an opponent and my IDE agent selected in IDE', function () {
        beforeEach(function() {
          runData.currentPlayers = [ opponent2, ideAgent ];
        });

        describe('with "Perform each ... swapped" unselected', function () {
          beforeEach(function() {
            params.swapEnabled = false;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            it('should create a single match for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(1);
            });

            it('should create two matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should keep both opponents as selected for each match', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            it('should create two matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should create four matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should replace IDE with arena for even matches', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
            });
          });
        });

        describe('with "Perform each ... swapped" selected', function () {
          beforeEach(function() {
            params.swapEnabled = true;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            it('should create two matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should create four matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should swap opponents in even matches', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(ideAgent.agentId);
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            it('should create four matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should create eight matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(8);
            });

            it('should swap opponents and switch arena for ide', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(arenaAgent.agentId);
            });
          });
        });
      });



      describe('with my arena agent and an opponent selected in IDE', function () {
        beforeEach(function() {
          runData.currentPlayers = [ arenaAgent, opponent2 ];
        });

        describe('with "Perform each ... swapped" unselected', function () {
          beforeEach(function() {
            params.swapEnabled = false;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            it('should create a single match for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(1);
            });

            it('should create two matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should keep both opponents as selected for each match', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            it('should create two matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should create four matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should replace IDE with arena for even matches', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
            });
          });
        });

        describe('with "Perform each ... swapped" selected', function () {
          beforeEach(function() {
            params.swapEnabled = true;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            it('should create two matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should create four matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should swap opponents in even matches', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(ideAgent.agentId);
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            it('should create four matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should create eight matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(8);
            });

            it('should swap opponents and switch arena for ide', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(arenaAgent.agentId);
            });
          });
        });
      });



      describe('with an opponent and my arena agent selected in IDE', function () {
        beforeEach(function() {
          runData.currentPlayers = [ opponent2, arenaAgent ];
        });

        describe('with "Perform each ... swapped" unselected', function () {
          beforeEach(function() {
            params.swapEnabled = false;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            it('should create a single match for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(1);
            });

            it('should create two matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should keep both opponents as selected for each match', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            it('should create two matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should create four matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should replace IDE with arena for even matches', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
            });
          });
        });

        describe('with "Perform each ... swapped" selected', function () {
          beforeEach(function() {
            params.swapEnabled = true;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            it('should create two matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(2);
            });

            it('should create four matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should swap opponents in even matches', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(ideAgent.agentId);
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            it('should create four matches for 1 iteration', function () {
              params.iterations = 1;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(4);
            });

            it('should create eight matches for 2 iterations', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches.length).toBe(8);
            });

            it('should swap opponents and switch arena for ide', function () {
              params.iterations = 2;
              params = MatchGenerator.addMatchesToParams(runData, params);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
              expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
              expect(params.matches[2].agents[0].agentId).toBe(arenaAgent.agentId);
              expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
              expect(params.matches[3].agents[1].agentId).toBe(arenaAgent.agentId);
            });
          });
        });
      });
    });


    describe('with "... range ... above and below me" selected', function () {
      var allOpponents = [ opponent2, opponent3, opponent4, opponent5, opponent6, opponent7, opponent8, opponent9, opponent10 ];

      beforeEach(function() {
        var nextOpponent = 0;
        MatchGenerator.__FOR_TEST_setRandomOpponentNumFunc(() => { return nextOpponent++; });
        params.opponentSelectionType = 'range';
        runData.candidateAgents = allOpponents.slice(0);
      });

      afterEach(function() {
        MatchGenerator.__FOR_TEST_resetRandomOpponentNumFunc();
      });

      describe('with an opponent and my IDE agent selected in IDE', function () {
        beforeEach(function() {
          runData.currentPlayers = [ ideAgent, opponent1 ];
        });

        describe('with "Perform each ... swapped" unselected', function () {
          beforeEach(function() {
            params.swapEnabled = false;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                  params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep both opponents in the same order for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent3.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep all three opponents in the same order for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent6.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                  params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep all four opponents in the same order for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent6.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent5.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent7.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent9.agentId);
              });
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent3.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent6.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent6.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent6.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent5.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(opponent7.agentId);
                expect(params.matches[2].agents[3].agentId).toBe(opponent9.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent5.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent7.agentId);
                expect(params.matches[3].agents[3].agentId).toBe(opponent9.agentId);
              });
            });
          });
        });

        describe('with "Perform each ... swapped" selected', function () {
          beforeEach(function() {
            params.swapEnabled = true;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should swap opponent order in the second match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(ideAgent.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create three matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(3);
              });

              it('should create six matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(6);
              });

              it('should swap opponent order in the second and third matches', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(opponent6.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(opponent6.agentId);
                expect(params.matches[5].agents[2].agentId).toBe(ideAgent.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create four matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should create eight matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(8);
              });

              it('should swap opponent order in the second, third, and fourth matches', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent6.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent6.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent6.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[3].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[3].agents[3].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(opponent5.agentId);
                expect(params.matches[4].agents[2].agentId).toBe(opponent7.agentId);
                expect(params.matches[4].agents[3].agentId).toBe(opponent9.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent9.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[5].agents[2].agentId).toBe(opponent5.agentId);
                expect(params.matches[5].agents[3].agentId).toBe(opponent7.agentId);
                expect(params.matches[6].agents[0].agentId).toBe(opponent7.agentId);
                expect(params.matches[6].agents[1].agentId).toBe(opponent9.agentId);
                expect(params.matches[6].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[6].agents[3].agentId).toBe(opponent5.agentId);
                expect(params.matches[7].agents[0].agentId).toBe(opponent5.agentId);
                expect(params.matches[7].agents[1].agentId).toBe(opponent7.agentId);
                expect(params.matches[7].agents[2].agentId).toBe(opponent9.agentId);
                expect(params.matches[7].agents[3].agentId).toBe(ideAgent.agentId);
              });
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create four matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should create eight matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(8);
              });

              it('should swap opponent order and IDE to arena code for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[6].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[6].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[7].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[7].agents[1].agentId).toBe(arenaAgent.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create six matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(6);
              });

              it('should create twelve matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(12);
              });

              it('should swap opponent order and IDE to arena code for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[4].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[5].agents[2].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[6].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[6].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[6].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[7].agents[0].agentId).toBe(opponent6.agentId);
                expect(params.matches[7].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[7].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[8].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[8].agents[1].agentId).toBe(opponent6.agentId);
                expect(params.matches[8].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[9].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[9].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[9].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[10].agents[0].agentId).toBe(opponent6.agentId);
                expect(params.matches[10].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[10].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[11].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[11].agents[1].agentId).toBe(opponent6.agentId);
                expect(params.matches[11].agents[2].agentId).toBe(arenaAgent.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create eight matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(8);
              });

              it('should create sixteen matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(16);
              });

              it('should swap opponent order and IDE to arena code for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent6.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent6.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent6.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[3].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[3].agents[3].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[4].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[4].agents[3].agentId).toBe(opponent6.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent6.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[5].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[5].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[6].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[6].agents[1].agentId).toBe(opponent6.agentId);
                expect(params.matches[6].agents[2].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[6].agents[3].agentId).toBe(opponent2.agentId);
                expect(params.matches[7].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[7].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[7].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[7].agents[3].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[8].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[8].agents[1].agentId).toBe(opponent5.agentId);
                expect(params.matches[8].agents[2].agentId).toBe(opponent7.agentId);
                expect(params.matches[8].agents[3].agentId).toBe(opponent9.agentId);
                expect(params.matches[9].agents[0].agentId).toBe(opponent9.agentId);
                expect(params.matches[9].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[9].agents[2].agentId).toBe(opponent5.agentId);
                expect(params.matches[9].agents[3].agentId).toBe(opponent7.agentId);
                expect(params.matches[10].agents[0].agentId).toBe(opponent7.agentId);
                expect(params.matches[10].agents[1].agentId).toBe(opponent9.agentId);
                expect(params.matches[10].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[10].agents[3].agentId).toBe(opponent5.agentId);
                expect(params.matches[11].agents[0].agentId).toBe(opponent5.agentId);
                expect(params.matches[11].agents[1].agentId).toBe(opponent7.agentId);
                expect(params.matches[11].agents[2].agentId).toBe(opponent9.agentId);
                expect(params.matches[11].agents[3].agentId).toBe(ideAgent.agentId);
                expect(params.matches[12].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[12].agents[1].agentId).toBe(opponent5.agentId);
                expect(params.matches[12].agents[2].agentId).toBe(opponent7.agentId);
                expect(params.matches[12].agents[3].agentId).toBe(opponent9.agentId);
                expect(params.matches[13].agents[0].agentId).toBe(opponent9.agentId);
                expect(params.matches[13].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[13].agents[2].agentId).toBe(opponent5.agentId);
                expect(params.matches[13].agents[3].agentId).toBe(opponent7.agentId);
                expect(params.matches[14].agents[0].agentId).toBe(opponent7.agentId);
                expect(params.matches[14].agents[1].agentId).toBe(opponent9.agentId);
                expect(params.matches[14].agents[2].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[14].agents[3].agentId).toBe(opponent5.agentId);
                expect(params.matches[15].agents[0].agentId).toBe(opponent5.agentId);
                expect(params.matches[15].agents[1].agentId).toBe(opponent7.agentId);
                expect(params.matches[15].agents[2].agentId).toBe(opponent9.agentId);
                expect(params.matches[15].agents[3].agentId).toBe(arenaAgent.agentId);
              });
            });
          });
        });
      });
    });



    describe('with "custom range" selected', function () {
      var allOpponents = [ opponent2, opponent3, opponent4, opponent5, opponent6, opponent7, opponent8, opponent9, opponent10 ];

      beforeEach(function() {
        var nextOpponent = 0;
        MatchGenerator.__FOR_TEST_setRandomOpponentNumFunc(() => { return nextOpponent++; });
        params.opponentSelectionType = 'custom';
        runData.candidateAgents = allOpponents.slice(0);
      });

      afterEach(function() {
        MatchGenerator.__FOR_TEST_resetRandomOpponentNumFunc(() => { return nextOpponent++; });
      });

      describe('with an opponent and my IDE agent selected in IDE', function () {
        beforeEach(function() {
          runData.currentPlayers = [ ideAgent, opponent1 ];
        });

        describe('with "Perform each ... swapped" unselected', function () {
          beforeEach(function() {
            params.swapEnabled = false;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep both opponents in the same order for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent3.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                  params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep all three opponents in the same order for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent6.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create a single match for 1 iteration', function () {
                  params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(1);
              });

              it('should create two matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should keep all four opponents in the same order for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent6.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent5.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent7.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent9.agentId);
              });
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent3.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent6.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should keep both opponents as selected for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent6.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent6.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent5.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(opponent7.agentId);
                expect(params.matches[2].agents[3].agentId).toBe(opponent9.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent5.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent7.agentId);
                expect(params.matches[3].agents[3].agentId).toBe(opponent9.agentId);
              });
            });
          });
        });

        describe('with "Perform each ... swapped" selected', function () {
          beforeEach(function() {
            params.swapEnabled = true;
          });

          describe('with "Perform each ... IDE code and Arena code" unselected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = false;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create two matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(2);
              });

              it('should create four matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should swap opponent order in the second match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(ideAgent.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create three matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(3);
              });

              it('should create six matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(6);
              });

              it('should swap opponent order in the second and third matches', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(opponent6.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(opponent6.agentId);
                expect(params.matches[5].agents[2].agentId).toBe(ideAgent.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create four matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should create eight matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(8);
              });

              it('should swap opponent order in the second, third, and fourth matches', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent6.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent6.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent6.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[3].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[3].agents[3].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(opponent5.agentId);
                expect(params.matches[4].agents[2].agentId).toBe(opponent7.agentId);
                expect(params.matches[4].agents[3].agentId).toBe(opponent9.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent9.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[5].agents[2].agentId).toBe(opponent5.agentId);
                expect(params.matches[5].agents[3].agentId).toBe(opponent7.agentId);
                expect(params.matches[6].agents[0].agentId).toBe(opponent7.agentId);
                expect(params.matches[6].agents[1].agentId).toBe(opponent9.agentId);
                expect(params.matches[6].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[6].agents[3].agentId).toBe(opponent5.agentId);
                expect(params.matches[7].agents[0].agentId).toBe(opponent5.agentId);
                expect(params.matches[7].agents[1].agentId).toBe(opponent7.agentId);
                expect(params.matches[7].agents[2].agentId).toBe(opponent9.agentId);
                expect(params.matches[7].agents[3].agentId).toBe(ideAgent.agentId);
              });
            });
          });

          describe('with "Perform each ... IDE code and Arena code" selected', function () {
            beforeEach(function() {
              params.arenaCodeEnabled = true;
            });

            describe('with 1 opponent', function() {
              beforeEach(function() {
                params.numOpponents = 1;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create four matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(4);
              });

              it('should create eight matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(8);
              });

              it('should swap opponent order and IDE to arena code for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[6].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[6].agents[1].agentId).toBe(opponent3.agentId);
                expect(params.matches[7].agents[0].agentId).toBe(opponent3.agentId);
                expect(params.matches[7].agents[1].agentId).toBe(arenaAgent.agentId);
              });
            });

            describe('with 2 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 2;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create six matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(6);
              });

              it('should create twelve matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(12);
              });

              it('should swap opponent order and IDE to arena code for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[4].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[5].agents[2].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[6].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[6].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[6].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[7].agents[0].agentId).toBe(opponent6.agentId);
                expect(params.matches[7].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[7].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[8].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[8].agents[1].agentId).toBe(opponent6.agentId);
                expect(params.matches[8].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[9].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[9].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[9].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[10].agents[0].agentId).toBe(opponent6.agentId);
                expect(params.matches[10].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[10].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[11].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[11].agents[1].agentId).toBe(opponent6.agentId);
                expect(params.matches[11].agents[2].agentId).toBe(arenaAgent.agentId);
              });
            });

            describe('with 3 opponents', function() {
              beforeEach(function() {
                params.numOpponents = 3;
                runData.currentPlayers = runData.currentPlayers.slice(0, params.numOpponents+1);
              });

              it('should create eight matches for 1 iteration', function () {
                params.iterations = 1;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(8);
              });

              it('should create sixteen matches for 2 iterations', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches.length).toBe(16);
              });

              it('should swap opponent order and IDE to arena code for each match', function () {
                params.iterations = 2;
                params = MatchGenerator.addMatchesToParams(runData, params);
                expect(params.matches[0].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[0].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[0].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[0].agents[3].agentId).toBe(opponent6.agentId);
                expect(params.matches[1].agents[0].agentId).toBe(opponent6.agentId);
                expect(params.matches[1].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[1].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[1].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[2].agents[1].agentId).toBe(opponent6.agentId);
                expect(params.matches[2].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[2].agents[3].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[3].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[3].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[3].agents[3].agentId).toBe(ideAgent.agentId);
                expect(params.matches[4].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[4].agents[1].agentId).toBe(opponent2.agentId);
                expect(params.matches[4].agents[2].agentId).toBe(opponent4.agentId);
                expect(params.matches[4].agents[3].agentId).toBe(opponent6.agentId);
                expect(params.matches[5].agents[0].agentId).toBe(opponent6.agentId);
                expect(params.matches[5].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[5].agents[2].agentId).toBe(opponent2.agentId);
                expect(params.matches[5].agents[3].agentId).toBe(opponent4.agentId);
                expect(params.matches[6].agents[0].agentId).toBe(opponent4.agentId);
                expect(params.matches[6].agents[1].agentId).toBe(opponent6.agentId);
                expect(params.matches[6].agents[2].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[6].agents[3].agentId).toBe(opponent2.agentId);
                expect(params.matches[7].agents[0].agentId).toBe(opponent2.agentId);
                expect(params.matches[7].agents[1].agentId).toBe(opponent4.agentId);
                expect(params.matches[7].agents[2].agentId).toBe(opponent6.agentId);
                expect(params.matches[7].agents[3].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[8].agents[0].agentId).toBe(ideAgent.agentId);
                expect(params.matches[8].agents[1].agentId).toBe(opponent5.agentId);
                expect(params.matches[8].agents[2].agentId).toBe(opponent7.agentId);
                expect(params.matches[8].agents[3].agentId).toBe(opponent9.agentId);
                expect(params.matches[9].agents[0].agentId).toBe(opponent9.agentId);
                expect(params.matches[9].agents[1].agentId).toBe(ideAgent.agentId);
                expect(params.matches[9].agents[2].agentId).toBe(opponent5.agentId);
                expect(params.matches[9].agents[3].agentId).toBe(opponent7.agentId);
                expect(params.matches[10].agents[0].agentId).toBe(opponent7.agentId);
                expect(params.matches[10].agents[1].agentId).toBe(opponent9.agentId);
                expect(params.matches[10].agents[2].agentId).toBe(ideAgent.agentId);
                expect(params.matches[10].agents[3].agentId).toBe(opponent5.agentId);
                expect(params.matches[11].agents[0].agentId).toBe(opponent5.agentId);
                expect(params.matches[11].agents[1].agentId).toBe(opponent7.agentId);
                expect(params.matches[11].agents[2].agentId).toBe(opponent9.agentId);
                expect(params.matches[11].agents[3].agentId).toBe(ideAgent.agentId);
                expect(params.matches[12].agents[0].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[12].agents[1].agentId).toBe(opponent5.agentId);
                expect(params.matches[12].agents[2].agentId).toBe(opponent7.agentId);
                expect(params.matches[12].agents[3].agentId).toBe(opponent9.agentId);
                expect(params.matches[13].agents[0].agentId).toBe(opponent9.agentId);
                expect(params.matches[13].agents[1].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[13].agents[2].agentId).toBe(opponent5.agentId);
                expect(params.matches[13].agents[3].agentId).toBe(opponent7.agentId);
                expect(params.matches[14].agents[0].agentId).toBe(opponent7.agentId);
                expect(params.matches[14].agents[1].agentId).toBe(opponent9.agentId);
                expect(params.matches[14].agents[2].agentId).toBe(arenaAgent.agentId);
                expect(params.matches[14].agents[3].agentId).toBe(opponent5.agentId);
                expect(params.matches[15].agents[0].agentId).toBe(opponent5.agentId);
                expect(params.matches[15].agents[1].agentId).toBe(opponent7.agentId);
                expect(params.matches[15].agents[2].agentId).toBe(opponent9.agentId);
                expect(params.matches[15].agents[3].agentId).toBe(arenaAgent.agentId);
              });
            });
          });
        });
      });
    });
  });
})();
