import createGameboard from "./gameboard.js";

const BOARD_SIZE = 10;
const MAX_PLACEMENT_ATTEMPTS = 1000;

export default function createPlayers() {
  // Creates a human player's empty gameboard.
  // Ships will later be placed through the UI.
  const createRealPlayer = () => {
    return createGameboard();
  };

  // Creates a computer player's gameboard
  // and automatically places its fleet.
  const createComputerPlayer = (shipLengths) => {
    const gameboard = createGameboard();

    placeRandomShips(gameboard, shipLengths);

    return gameboard;
  };

  return { createRealPlayer, createComputerPlayer };
}

function placeRandomShips(gameboard, shipLengths) {
  if (!Array.isArray(shipLengths)) {
    throw new Error("shipLengths must be an array");
  }

  shipLengths.forEach((shipLength) => {
    placeRandomShip(gameboard, shipLength);
  });

  return gameboard;
}

function placeRandomShip(gameboard, shipLength) {
  for (let attempt = 0; attempt < MAX_PLACEMENT_ATTEMPTS; attempt++) {
    const orientation = Math.random() < 0.5 ? "vertical" : "horizontal";

    let rowStart;
    let colStart;

    if (orientation === "vertical") {
      // The row must leave enough space for the whole ship.
      const maximumStartingRow = BOARD_SIZE - shipLength;

      rowStart = getRandomInteger(maximumStartingRow);
      colStart = getRandomInteger(BOARD_SIZE - 1);
    } else {
      // The column must leave enough space for the whole ship.
      rowStart = getRandomInteger(BOARD_SIZE - 1);

      const maximumStartingColumn = BOARD_SIZE - shipLength;
      colStart = getRandomInteger(maximumStartingColumn);
    }

    const shipPlaced = gameboard.addShip(
      shipLength,
      rowStart,
      colStart,
      orientation,
    );

    if (shipPlaced) {
      return true;
    }
  }

  throw new Error(
    `Unable to place ship of length ${shipLength} after ${MAX_PLACEMENT_ATTEMPTS} attempts`,
  );
}

function getRandomInteger(maximumInclusive) {
  return Math.floor(Math.random() * (maximumInclusive + 1));
}
