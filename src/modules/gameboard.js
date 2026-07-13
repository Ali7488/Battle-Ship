import createShip from "./ship.js";

export default function createGameboard() {
  //creates the gameboard as a 10x10 2D array that stores null for all empty posititions
  const board = Array.from({ length: 10 }, () => {
    return Array.from({ length: 10 }, () => ({ ship: null, attacked: false }));
  });

  // Board getter method
  const getBoard = () => {
    return board;
  };

  // reset board method for restarting the game
  const resetBoard = () => {
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.ship = null;
        cell.attacked = false;
      });
    });
  };

  const addShip = (
    shipLength,
    rowStart,
    colStart,
    orientation = "horizontal",
  ) => {
    // Validate ship length
    if (!Number.isInteger(shipLength) || shipLength <= 0 || shipLength >= 10) {
      throw new Error("Length must be a positive integer that is less than 10");
    }

    // Validate starting row
    if (!Number.isInteger(rowStart) || rowStart < 0 || rowStart >= 10) {
      throw new Error("rowStart must be an integer from 0 to 9");
    }

    // Validate starting column
    if (!Number.isInteger(colStart) || colStart < 0 || colStart >= 10) {
      throw new Error("colStart must be an integer from 0 to 9");
    }

    // Validate and normalize orientation
    if (typeof orientation !== "string") {
      throw new Error('Orientation must be "horizontal" or "vertical"');
    }

    const normalizedOrientation = orientation.toLowerCase();

    if (
      normalizedOrientation !== "horizontal" &&
      normalizedOrientation !== "vertical"
    ) {
      throw new Error('Orientation must be "horizontal" or "vertical"');
    }

    // Check whether the ship would extend outside the board
    const isOutOfBounds =
      normalizedOrientation === "vertical"
        ? rowStart + shipLength > 10
        : colStart + shipLength > 10;

    if (isOutOfBounds) {
      return false;
    }

    // Check every intended cell before modifying the board
    for (let index = 0; index < shipLength; index++) {
      const currentRow =
        normalizedOrientation === "vertical" ? rowStart + index : rowStart;

      const currentCol =
        normalizedOrientation === "horizontal" ? colStart + index : colStart;

      if (board[currentRow][currentCol].ship !== null) {
        return false;
      }
    }

    // Placement is valid, so create and place the ship
    const ship = createShip(shipLength);

    for (let index = 0; index < shipLength; index++) {
      const currentRow =
        normalizedOrientation === "vertical" ? rowStart + index : rowStart;

      const currentCol =
        normalizedOrientation === "horizontal" ? colStart + index : colStart;

      board[currentRow][currentCol].ship = ship;
    }

    return true;
  };

  
  return { getBoard, addShip, resetBoard };
}
