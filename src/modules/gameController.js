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

  const getCurrentPlayerId = () => {
    return currentPlayer === player1 ? "player1" : "player2";
  };

  const switchTurns = () => {
    const previousPlayer = currentPlayer;

    currentPlayer = currentOpponent;
    currentOpponent = previousPlayer;
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
    if (winner !== null) {
      return {
        winner,
        attacks: [],
      };
    }

    if (normalizedMode === "human") {
      return realPlayerGameLogic(row, col);
    }

    return computerGameLogic(row, col);
  };

  const getGameState = () => {
    return {
      player1Board: player1.getBoard(),
      player2Board: player2.getBoard(),
      currentPlayerId: getCurrentPlayerId(),
      winner,
    };
  };

  return {
    playTurn,
    getGameState,
  };
}
