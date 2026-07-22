import gameController from "../src/modules/gameController.js";

describe("gameController", () => {
  let controllerPc;
  let controllerHuman;

  const countAttackedCells = (board) => {
    return board.flat().filter((cell) => cell.attacked).length;
  };

  beforeEach(() => {
    controllerPc = gameController("computer");
    controllerHuman = gameController("human");
  });

  describe("mode validation", () => {
    test("rejects an unsupported mode", () => {
      expect(() => {
        gameController("notComputer");
      }).toThrow("mode must be human or computer");
    });

    test("rejects an empty mode", () => {
      expect(() => {
        gameController("");
      }).toThrow("mode must be a string");
    });

    test("rejects a non-string mode", () => {
      expect(() => {
        gameController(null);
      }).toThrow("mode must be a string");
    });

    test("normalizes capitalization and whitespace", () => {
      expect(() => {
        gameController("  COMPUTER  ");
      }).not.toThrow();
    });
  });

  describe("getGameState", () => {
    test("returns both boards, the current player, and winner", () => {
      const state = controllerHuman.getGameState();

      expect(state).toEqual(
        expect.objectContaining({
          player1Board: expect.any(Array),
          player2Board: expect.any(Array),
          currentPlayerId: "player1",
          winner: null,
        }),
      );
    });

    test("returns two 10 by 10 boards", () => {
      const state = controllerHuman.getGameState();

      expect(state.player1Board).toHaveLength(10);
      expect(state.player2Board).toHaveLength(10);

      state.player1Board.forEach((row) => {
        expect(row).toHaveLength(10);
      });

      state.player2Board.forEach((row) => {
        expect(row).toHaveLength(10);
      });
    });
  });

  describe("human versus computer", () => {
    test("returns one human attack and one computer attack", () => {
      const result = controllerPc.playTurn(4, 6);

      expect(result.winner).toBeNull();
      expect(result.attacks).toHaveLength(2);

      const humanAttack = result.attacks[0];
      const computerAttack = result.attacks[1];

      expect(humanAttack).toEqual({
        attacker: "player1",
        row: 4,
        col: 6,
        attackStatus: expect.any(String),
      });

      expect(["miss", "hit", "sunk"]).toContain(humanAttack.attackStatus);

      expect(computerAttack).toEqual({
        attacker: "computer",
        row: expect.any(Number),
        col: expect.any(Number),
        attackStatus: expect.any(String),
      });

      expect(["miss", "hit", "sunk"]).toContain(computerAttack.attackStatus);
    });

    test("computer chooses coordinates inside the board", () => {
      const result = controllerPc.playTurn(4, 6);
      const computerAttack = result.attacks[1];

      expect(computerAttack.row).toBeGreaterThanOrEqual(0);
      expect(computerAttack.row).toBeLessThan(10);

      expect(computerAttack.col).toBeGreaterThanOrEqual(0);
      expect(computerAttack.col).toBeLessThan(10);
    });

    test("both returned attacks update their respective boards", () => {
      const result = controllerPc.playTurn(4, 6);
      const computerAttack = result.attacks[1];

      const state = controllerPc.getGameState();

      // The human attacks player2, which is the computer board.
      expect(state.player2Board[4][6].attacked).toBe(true);

      // The computer attacks player1's board.
      expect(
        state.player1Board[computerAttack.row][computerAttack.col].attacked,
      ).toBe(true);
    });

    test("an already-attacked cell does not trigger another computer attack", () => {
      controllerPc.playTurn(4, 6);

      const stateBeforeRepeat = controllerPc.getGameState();
      const attacksBeforeRepeat = countAttackedCells(
        stateBeforeRepeat.player1Board,
      );

      const result = controllerPc.playTurn(4, 6);

      const stateAfterRepeat = controllerPc.getGameState();
      const attacksAfterRepeat = countAttackedCells(
        stateAfterRepeat.player1Board,
      );

      expect(result.winner).toBeNull();
      expect(result.attacks).toHaveLength(1);

      expect(result.attacks[0]).toEqual({
        attacker: "player1",
        row: 4,
        col: 6,
        attackStatus: "already-attacked",
      });

      // The computer did not receive another turn.
      expect(attacksAfterRepeat).toBe(attacksBeforeRepeat);
    });
  });

  describe("human versus human", () => {
    test("starts with player1", () => {
      const state = controllerHuman.getGameState();

      expect(state.currentPlayerId).toBe("player1");
    });

    test("switches to player2 after player1 makes a valid attack", () => {
      const result = controllerHuman.playTurn(4, 6);
      const state = controllerHuman.getGameState();

      expect(result.attacks).toHaveLength(1);
      expect(result.attacks[0].attacker).toBe("player1");
      expect(state.currentPlayerId).toBe("player2");
    });

    test("switches back to player1 after player2 attacks", () => {
      controllerHuman.playTurn(4, 6);

      const result = controllerHuman.playTurn(2, 3);
      const state = controllerHuman.getGameState();

      expect(result.attacks[0].attacker).toBe("player2");
      expect(state.currentPlayerId).toBe("player1");
    });

    test("an already-attacked cell does not switch turns", () => {
      // Player 1 attacks Player 2's board.
      controllerHuman.playTurn(4, 6);

      // Player 2 attacks Player 1's board.
      controllerHuman.playTurn(2, 3);

      // It is Player 1's turn again. They repeat their first attack.
      const result = controllerHuman.playTurn(4, 6);
      const state = controllerHuman.getGameState();

      expect(result.winner).toBeNull();

      expect(result.attacks).toEqual([
        {
          attacker: "player1",
          row: 4,
          col: 6,
          attackStatus: "already-attacked",
        },
      ]);

      // Player 1 keeps the turn after the invalid attack.
      expect(state.currentPlayerId).toBe("player1");
    });

    test("player2 attacks are applied to player1's board", () => {
      controllerHuman.playTurn(4, 6);
      controllerHuman.playTurn(2, 3);

      const state = controllerHuman.getGameState();

      expect(state.player1Board[2][3].attacked).toBe(true);
    });

    test("player1 attacks are applied to player2's board", () => {
      controllerHuman.playTurn(4, 6);

      const state = controllerHuman.getGameState();

      expect(state.player2Board[4][6].attacked).toBe(true);
    });
  });

  describe("winning behavior", () => {
    test.todo("sets player1 as winner when player1 sinks player2's fleet");

    test.todo("sets player2 as winner when player2 sinks player1's fleet");

    test.todo(
      "sets computer as winner when the computer sinks player1's fleet",
    );

    test.todo("prevents additional board mutations after a winner is assigned");
  });
});
