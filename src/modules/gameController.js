import createPlayers from "./players.js";
import { humanPlayTurn, computerPlayTurn } from "./turnLogic.js";

export default function gameController(mode) {
  //input validation and normalizing the selected gamemode
  if (typeof mode !== "string" || mode.trim() === "") {
    throw new Error("mode must be a string");
  }

  const normalizedMode = mode.trim().toLowerCase();

  const inputValid =
    normalizedMode === "human" || normalizedMode === "computer";

  if (!inputValid) throw new Error("mode must be human or computer");

  // Setup player profiles
  const playersFactory = createPlayers();

  let player1;
  let player2;
  let currentPlayer;
  let currentOpponent;
  let winner = null;

  //create appropriate players for the selected mode
  if (normalizedMode === "computer") {
    const computerShips = [2, 3, 3, 3, 4];

    player1 = playersFactory.createRealPlayer();
    player2 = playersFactory.createComputerPlayer(computerShips);
  } else {
    player1 = playersFactory.createRealPlayer();
    player2 = playersFactory.createRealPlayer();
  }

  currentPlayer = player1;
  currentOpponent = player2;

  const fleetTemplate = [2, 3, 3, 3, 4];

  let phase = "placement";
  let currentPlacementPlayerId = "player1";

  const remainingShips = {
    player1: [...fleetTemplate],
    player2: normalizedMode === "human" ? [...fleetTemplate] : [],
  };

  const getCurrentPlayerId = () => {
    return currentPlayer === player1 ? "player1" : "player2";
  };

  const switchTurns = () => {
    const previousPlayer = currentPlayer;

    currentPlayer = currentOpponent;
    currentOpponent = previousPlayer;
  };

  const placeShip = (length, row, col, orientation) => {
    if (phase !== "placement") {
      return {
        placementStatus: "placement-finished",
        placedShip: null,
      };
    }

    const shipsToPlace = remainingShips[currentPlacementPlayerId];
    const shipIndex = shipsToPlace.indexOf(length);

    if (shipIndex === -1) {
      return {
        placementStatus: "ship-not-available",
        placedShip: null,
      };
    }

    const placementBoard =
      currentPlacementPlayerId === "player1" ? player1 : player2;

    const placementSucceeded = placementBoard.addShip(
      length,
      row,
      col,
      orientation,
    );

    if (!placementSucceeded) {
      return {
        placementStatus: "invalid-placement",
        placedShip: null,
      };
    }

    const placedBy = currentPlacementPlayerId;

    // Remove only one occurrence because the fleet contains repeated lengths.
    shipsToPlace.splice(shipIndex, 1);

    if (shipsToPlace.length === 0) {
      if (
        normalizedMode === "human" &&
        currentPlacementPlayerId === "player1"
      ) {
        currentPlacementPlayerId = "player2";
      } else {
        phase = "playing";
        currentPlacementPlayerId = null;
        currentPlayer = player1;
        currentOpponent = player2;
      }
    }

    return {
      placementStatus: "placed",
      placedShip: {
        placedBy,
        length,
        row,
        col,
        orientation,
      },
    };
  };

  // logic for game in player vs player
  const realPlayerGameLogic = (row, col) => {
    const attacker = currentPlayer === player1 ? "player1" : "player2";
    const attackStatus = humanPlayTurn(row, col, currentOpponent);

    const attack = {
      attacker,
      row,
      col,
      attackStatus,
    };

    // Invalid attacks do not change turns
    if (attackStatus === "already-attacked") {
      return {
        winner,
        attacks: [attack],
      };
    }

    // The current player wins if all opponent's ships are all sunk
    if (currentOpponent.allShipsSunk()) {
      winner = currentPlayer === player1 ? "player1" : "player2";

      return {
        winner,
        attacks: [attack],
      };
    }

    switchTurns();
    return {
      winner,
      attacks: [attack],
    };
  };

  // logic for game in player vs computer
  const computerGameLogic = (row, col) => {
    const humanAttackStatus = humanPlayTurn(row, col, player2);

    const humanAttack = {
      attacker: "player1",
      row,
      col,
      attackStatus: humanAttackStatus,
    };

    // The computer does not attack after an invalid human move.
    if (humanAttackStatus === "already-attacked") {
      return {
        winner,
        attacks: [humanAttack],
      };
    }

    // Stop immediately if the human sinks the computer's fleet.
    if (player2.allShipsSunk()) {
      winner = "player1";

      return {
        winner,
        attacks: [humanAttack],
      };
    }

    const computerAttackInfo = computerPlayTurn(player1);

    const computerAttack = {
      attacker: "computer",
      row: computerAttackInfo.row,
      col: computerAttackInfo.col,
      attackStatus: computerAttackInfo.attackStatus,
    };

    if (player1.allShipsSunk()) {
      winner = "computer";
    }

    return {
      winner,
      attacks: [humanAttack, computerAttack],
    };
  };

  const playTurn = (row, col) => {
    if (phase !== "playing") {
      return {
        winner,
        attacks: [],
        turnStatus: "placement-not-finished",
      };
    }

    if (winner !== null) {
      return {
        winner,
        attacks: [],
        turnStatus: "game-finished",
      };
    }

    if (normalizedMode === "human") {
      return realPlayerGameLogic(row, col);
    }

    return computerGameLogic(row, col);
  };

  const getGameState = () => {
    const remainingShipsToPlace =
      currentPlacementPlayerId === null
        ? []
        : [...remainingShips[currentPlacementPlayerId]];

    return {
      player1Board: player1.getBoard(),
      player2Board: player2.getBoard(),
      currentPlayerId: getCurrentPlayerId(),
      currentPlacementPlayerId,
      remainingShipsToPlace,
      phase,
      winner,
    };
  };

  return {
    placeShip,
    playTurn,
    getGameState,
  };
}
