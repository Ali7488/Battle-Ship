import { computerPlayTurn, humanPlayTurn } from "../src/modules/turnLogic.js";
import createPlayers from "../src/modules/players.js";

describe("turnLogic", () => {
  let player;
  let computer;
  let possibleResults;

  beforeEach(() => {
    const players = createPlayers();

    player = players.createRealPlayer();
    computer = players.createComputerPlayer([3, 4, 5]);

    possibleResults = ["hit", "sunk", "miss"];
  });

  test("Ensures player attack logic is correct", () => {
    const result = humanPlayTurn(4, 5, computer);

    expect(possibleResults.includes(result)).toBe(true);
  });

  test("Ensures player attack marks cell as attacked", () => {
    const result = humanPlayTurn(4, 5, computer);
    const board = computer.getBoard();
    expect(board[4][5].attacked).toBe(true);
  });
  
  test("Ensures computer attack logic is correct", () => {
    player.addShip(3, 3, 3, "horizontal");

    const result = computerPlayTurn(player);
    expect(result).toEqual(
      expect.objectContaining({
        row: expect.any(Number),
        col: expect.any(Number),
        attackStatus: expect.any(String),
      }),
    );

    expect(result.row).toBeGreaterThanOrEqual(0);
    expect(result.row).toBeLessThan(10);

    expect(result.col).toBeGreaterThanOrEqual(0);
    expect(result.col).toBeLessThan(10);

    expect(possibleResults.includes(result.attackStatus)).toBe(true);
  });

  test("computerPlayTurn marks its selected cell as attacked", () => {
    const result = computerPlayTurn(player);
    const board = player.getBoard();

    expect(board[result.row][result.col].attacked).toBe(true);
  });
});
