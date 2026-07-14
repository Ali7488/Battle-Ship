import createPlayers from "../src/modules/players.js";

describe("Players", () => {
  let players;

  beforeEach(() => {
    players = createPlayers();
  });

  describe("createRealPlayer", () => {
    test("creates a player with an empty gameboard", () => {
      const gameboard = players.createRealPlayer();
      const board = gameboard.getBoard();

      board.flat().forEach((cell) => {
        expect(cell.ship).toBeNull();
        expect(cell.attacked).toBe(false);
      });
    });
  });

  describe("createComputerPlayer", () => {
    test("creates a gameboard containing the requested fleet", () => {
      const shipLengths = [5, 4, 3, 3, 2];

      const gameboard = players.createComputerPlayer(shipLengths);
      const board = gameboard.getBoard();

      const occupiedCells = board.flat().filter((cell) => cell.ship !== null);

      const uniqueShips = [...new Set(occupiedCells.map((cell) => cell.ship))];

      expect(uniqueShips).toHaveLength(shipLengths.length);

      const generatedLengths = uniqueShips
        .map((ship) => ship.getLength())
        .sort((a, b) => a - b);

      const expectedLengths = [...shipLengths].sort((a, b) => a - b);

      expect(generatedLengths).toEqual(expectedLengths);
    });

    test("each generated ship occupies the correct number of cells", () => {
      const shipLengths = [5, 4, 3, 3, 2];

      const gameboard = players.createComputerPlayer(shipLengths);
      const board = gameboard.getBoard();

      const occupiedCells = board.flat().filter((cell) => cell.ship !== null);

      const uniqueShips = [...new Set(occupiedCells.map((cell) => cell.ship))];

      uniqueShips.forEach((ship) => {
        const cellsContainingShip = occupiedCells.filter(
          (cell) => cell.ship === ship,
        );

        expect(cellsContainingShip).toHaveLength(ship.getLength());
      });
    });

    test("does not mark generated ship cells as attacked", () => {
      const gameboard = players.createComputerPlayer([5, 4, 3, 3, 2]);

      const board = gameboard.getBoard();

      board.flat().forEach((cell) => {
        expect(cell.attacked).toBe(false);
      });
    });

    test("throws when shipLengths is not an array", () => {
      expect(() => {
        players.createComputerPlayer("5,4,3");
      }).toThrow("shipLengths must be an array");
    });
  });
});
