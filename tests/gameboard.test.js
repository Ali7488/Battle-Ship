import createGameboard from "../src/modules/gameboard.js";

describe("Gameboard", () => {
  let gameboard;
  let board;

  beforeEach(() => {
    gameboard = createGameboard();
    board = gameboard.getBoard();
  });

  describe("board creation", () => {
    test("creates a 10 by 10 board", () => {
      expect(board).toHaveLength(10);

      board.forEach((row) => {
        expect(row).toHaveLength(10);
      });
    });

    test("creates every cell with no ship and not attacked", () => {
      board.forEach((row) => {
        row.forEach((cell) => {
          expect(cell).toEqual({
            ship: null,
            attacked: false,
          });
        });
      });
    });

    test("creates separate arrays for every row", () => {
      expect(board[0]).not.toBe(board[1]);
    });

    test("creates a separate object for every cell", () => {
      expect(board[0][0]).not.toBe(board[0][1]);
      expect(board[0][0]).not.toBe(board[1][0]);

      board[0][0].attacked = true;

      expect(board[0][0].attacked).toBe(true);
      expect(board[0][1].attacked).toBe(false);
      expect(board[1][0].attacked).toBe(false);
    });
  });

  describe("input validation", () => {
    test("throws an error for an invalid ship length", () => {
      expect(() => {
        gameboard.addShip(-3, 5, 6, "horizontal");
      }).toThrow("Length must be a positive integer that is less than 10");

      expect(() => {
        gameboard.addShip(0, 5, 6, "horizontal");
      }).toThrow("Length must be a positive integer that is less than 10");

      expect(() => {
        gameboard.addShip(10, 0, 0, "horizontal");
      }).toThrow("Length must be a positive integer that is less than 10");

      expect(() => {
        gameboard.addShip(2.5, 5, 6, "horizontal");
      }).toThrow("Length must be a positive integer that is less than 10");
    });

    test("throws an error for an invalid starting row", () => {
      expect(() => {
        gameboard.addShip(3, -1, 6, "horizontal");
      }).toThrow("rowStart must be an integer from 0 to 9");

      expect(() => {
        gameboard.addShip(3, 10, 6, "horizontal");
      }).toThrow("rowStart must be an integer from 0 to 9");

      expect(() => {
        gameboard.addShip(3, 2.5, 6, "horizontal");
      }).toThrow("rowStart must be an integer from 0 to 9");
    });

    test("throws an error for an invalid starting column", () => {
      expect(() => {
        gameboard.addShip(3, 5, -1, "horizontal");
      }).toThrow("colStart must be an integer from 0 to 9");

      expect(() => {
        gameboard.addShip(3, 5, 10, "horizontal");
      }).toThrow("colStart must be an integer from 0 to 9");

      expect(() => {
        gameboard.addShip(3, 5, 2.5, "horizontal");
      }).toThrow("colStart must be an integer from 0 to 9");
    });

    test("throws an error for an invalid orientation", () => {
      expect(() => {
        gameboard.addShip(3, 5, 5, "diagonal");
      }).toThrow('Orientation must be "horizontal" or "vertical"');

      expect(() => {
        gameboard.addShip(3, 5, 5, null);
      }).toThrow('Orientation must be "horizontal" or "vertical"');
    });
  });

  describe("horizontal ship placement", () => {
    test("places a horizontal ship in the correct cells", () => {
      const result = gameboard.addShip(4, 3, 2, "horizontal");

      expect(result).toBe(true);

      const placedShip = board[3][2].ship;

      expect(placedShip).not.toBeNull();

      expect(board[3][2].ship).toBe(placedShip);
      expect(board[3][3].ship).toBe(placedShip);
      expect(board[3][4].ship).toBe(placedShip);
      expect(board[3][5].ship).toBe(placedShip);

      expect(board[3][1].ship).toBeNull();
      expect(board[3][6].ship).toBeNull();
    });

    test("does not mark placed ship cells as attacked", () => {
      gameboard.addShip(4, 3, 2, "horizontal");

      expect(board[3][2].attacked).toBe(false);
      expect(board[3][3].attacked).toBe(false);
      expect(board[3][4].attacked).toBe(false);
      expect(board[3][5].attacked).toBe(false);
    });

    test("allows a horizontal ship to end exactly at column 9", () => {
      const result = gameboard.addShip(4, 5, 6, "horizontal");

      expect(result).toBe(true);

      const placedShip = board[5][6].ship;

      expect(board[5][6].ship).toBe(placedShip);
      expect(board[5][7].ship).toBe(placedShip);
      expect(board[5][8].ship).toBe(placedShip);
      expect(board[5][9].ship).toBe(placedShip);
    });

    test("returns false when a horizontal ship goes out of bounds", () => {
      const result = gameboard.addShip(4, 5, 7, "horizontal");

      expect(result).toBe(false);

      expect(board[5][7].ship).toBeNull();
      expect(board[5][8].ship).toBeNull();
      expect(board[5][9].ship).toBeNull();
    });
  });

  describe("vertical ship placement", () => {
    test("places a vertical ship in the correct cells", () => {
      const result = gameboard.addShip(4, 2, 5, "vertical");

      expect(result).toBe(true);

      const placedShip = board[2][5].ship;

      expect(placedShip).not.toBeNull();

      expect(board[2][5].ship).toBe(placedShip);
      expect(board[3][5].ship).toBe(placedShip);
      expect(board[4][5].ship).toBe(placedShip);
      expect(board[5][5].ship).toBe(placedShip);

      expect(board[1][5].ship).toBeNull();
      expect(board[6][5].ship).toBeNull();
    });

    test("does not mark placed ship cells as attacked", () => {
      gameboard.addShip(4, 2, 5, "vertical");

      expect(board[2][5].attacked).toBe(false);
      expect(board[3][5].attacked).toBe(false);
      expect(board[4][5].attacked).toBe(false);
      expect(board[5][5].attacked).toBe(false);
    });

    test("allows a vertical ship to end exactly at row 9", () => {
      const result = gameboard.addShip(2, 8, 3, "vertical");

      expect(result).toBe(true);

      const placedShip = board[8][3].ship;

      expect(board[8][3].ship).toBe(placedShip);
      expect(board[9][3].ship).toBe(placedShip);
    });

    test("returns false when a vertical ship goes out of bounds", () => {
      const result = gameboard.addShip(3, 8, 3, "vertical");

      expect(result).toBe(false);

      expect(board[8][3].ship).toBeNull();
      expect(board[9][3].ship).toBeNull();
    });
  });

  describe("orientation handling", () => {
    test("normalizes orientation casing", () => {
      const result = gameboard.addShip(3, 4, 3, "Horizontal");

      expect(result).toBe(true);

      const placedShip = board[4][3].ship;

      expect(board[4][3].ship).toBe(placedShip);
      expect(board[4][4].ship).toBe(placedShip);
      expect(board[4][5].ship).toBe(placedShip);
    });

    test("uses horizontal placement by default", () => {
      const result = gameboard.addShip(3, 4, 3);

      expect(result).toBe(true);

      const placedShip = board[4][3].ship;

      expect(board[4][3].ship).toBe(placedShip);
      expect(board[4][4].ship).toBe(placedShip);
      expect(board[4][5].ship).toBe(placedShip);
    });
  });

  describe("overlapping ships", () => {
    test("rejects an overlapping ship", () => {
      gameboard.addShip(4, 2, 5, "vertical");

      const result = gameboard.addShip(4, 4, 3, "horizontal");

      expect(result).toBe(false);
    });

    test("does not partially place a ship when overlap is detected", () => {
      gameboard.addShip(4, 2, 5, "vertical");

      /*
        Proposed horizontal placement:

        [4][3] empty
        [4][4] empty
        [4][5] occupied
        [4][6] empty
      */

      const existingShip = board[4][5].ship;

      const result = gameboard.addShip(4, 4, 3, "horizontal");

      expect(result).toBe(false);

      expect(board[4][3].ship).toBeNull();
      expect(board[4][4].ship).toBeNull();
      expect(board[4][5].ship).toBe(existingShip);
      expect(board[4][6].ship).toBeNull();
    });

    test("failed placement does not change attacked state", () => {
      gameboard.addShip(4, 2, 5, "vertical");

      const result = gameboard.addShip(4, 4, 3, "horizontal");

      expect(result).toBe(false);

      expect(board[4][3].attacked).toBe(false);
      expect(board[4][4].attacked).toBe(false);
      expect(board[4][5].attacked).toBe(false);
      expect(board[4][6].attacked).toBe(false);
    });
  });

  describe("resetBoard", () => {
    test("resets all ships and attacks on the board", () => {
      gameboard.addShip(3, 2, 2, "horizontal");

      board[2][2].attacked = true;
      board[7][7].attacked = true;

      gameboard.resetBoard();

      board.forEach((row) => {
        row.forEach((cell) => {
          expect(cell.ship).toBeNull();
          expect(cell.attacked).toBe(false);
        });
      });
    });
  });

  describe("receiveAttack", () => {
    test("records a hit when attacking a cell containing a ship", () => {
      gameboard.addShip(4, 3, 2, "horizontal");

      const result = gameboard.receiveAttack(3, 2);

      expect(result).toBe("hit");
      expect(board[3][2].attacked).toBe(true);
      expect(board[3][2].ship).not.toBeNull();
    });

    test("records a miss when attacking an empty cell", () => {
      const result = gameboard.receiveAttack(6, 6);

      expect(result).toBe("miss");
      expect(board[6][6].attacked).toBe(true);
      expect(board[6][6].ship).toBeNull();
    });

    test("returns sunk when the final ship section is hit", () => {
       gameboard.addShip(2, 3, 2, "horizontal");

       const ship = board[3][2].ship;

       const firstResult = gameboard.receiveAttack(3, 3);
       const finalResult = gameboard.receiveAttack(3, 2);

       expect(firstResult).toBe("hit");
       expect(finalResult).toBe("sunk");

       expect(board[3][2].attacked).toBe(true);
       expect(board[3][3].attacked).toBe(true);
       expect(ship.isSunk()).toBe(true);
    });
  });
});
