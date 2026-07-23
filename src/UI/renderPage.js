export function startGame() {
  const homePage = document.getElementById("homeScreen");
  const gameScreen = document.getElementById("gameScreen");

  homePage.classList.add("hidden");
  gameScreen.classList.remove("hidden");
}

export function renderGrid(gameState) {
  //destructure the gameState object
  const {
    player1Board,
    player2Board,
    currentPlayerId,
    currentPlacementPlayerId,
    phase,
  } = gameState;
  const player1Grid = document.getElementById("player1-grid");
  const player2Grid = document.getElementById("player2-grid");

  //reset the boards to avoid duplication
  player1Grid.replaceChildren();
  player2Grid.replaceChildren();

  const visiblePlayerId =
    phase === "placement" ? currentPlacementPlayerId : currentPlayerId;

  const revealPlayer1sShips = visiblePlayerId === "player1";
  const revealPlayer2sShips = visiblePlayerId === "player2";

  //iterates through the arrays and displays the cells
  player1Board.forEach((row, indexRow) => {
    row.forEach((cell, indexCol) => {
      const button = renderSingleCell(
        revealPlayer1sShips,
        cell,
        indexRow,
        indexCol,
      );

      player1Grid.appendChild(button);
    });
  });

  player2Board.forEach((row, indexRow) => {
    row.forEach((cell, indexCol) => {
      const button = renderSingleCell(
        revealPlayer2sShips,
        cell,
        indexRow,
        indexCol,
      );

      player2Grid.appendChild(button);
    });
  });
}

export function renderPlacementControls(
  gameState,
  selectedShipLength,
  selectedOrientation,
  message = "",
) {
  const placementControls = document.getElementById("placementControls");
  const placementTitle = document.getElementById("placementTitle");
  const shipOptions = document.getElementById("shipOptions");
  const rotateShipBtn = document.getElementById("rotateShipBtn");
  const placementStatus = document.getElementById("placementStatus");

  if (gameState.phase !== "placement") {
    placementControls.classList.add("hidden");
    shipOptions.replaceChildren();
    placementStatus.textContent = "";
    return;
  }

  placementControls.classList.remove("hidden");

  const displayName =
    gameState.currentPlacementPlayerId === "player1" ? "Player 1" : "Player 2";

  placementTitle.textContent = `${displayName}: Place your fleet`;
  rotateShipBtn.textContent = `Orientation: ${
    selectedOrientation.charAt(0).toUpperCase() + selectedOrientation.slice(1)
  }`;

  shipOptions.replaceChildren();

  let selectedButtonMarked = false;

  gameState.remainingShipsToPlace.forEach((length) => {
    const shipButton = document.createElement("button");

    shipButton.type = "button";
    shipButton.classList.add("ship-option");
    shipButton.dataset.length = length;
    shipButton.textContent = `Length ${length}`;

    if (!selectedButtonMarked && selectedShipLength === length) {
      shipButton.classList.add("selected");
      selectedButtonMarked = true;
    }

    shipOptions.appendChild(shipButton);
  });

  placementStatus.textContent =
    message || "Select a ship, choose its orientation, then click your board.";
}

function renderSingleCell(revealShips, cell, indexRow, indexCol) {
  const button = document.createElement("button");

  button.type = "button";
  button.classList.add("game-cell");

  if (cell.attacked && cell.ship !== null) {
    button.classList.add("hit");
  } else if (cell.attacked && cell.ship === null) {
    button.classList.add("miss");
  } else if (cell.ship !== null && revealShips) {
    button.classList.add("game-cell-ship");
  }

  button.dataset.row = indexRow;
  button.dataset.col = indexCol;

  return button;
}

export function switchTurnScreen() {
  const gameScreen = document.getElementById("gameScreen");
  const hiddenScreen = document.getElementById("hiddenScreen");

  gameScreen.classList.toggle("hidden");
  hiddenScreen.classList.toggle("hidden");
}

export function displayWinner(winner) {
  const winnerName = document.getElementById("winnerName");
  const gameScreen = document.getElementById("gameScreen");
  const winnerScreen = document.getElementById("winnerScreen");

  gameScreen.classList.add("hidden");
  winnerScreen.classList.remove("hidden");
  const displayName = winner.charAt(0).toUpperCase() + winner.slice(1);
  winnerName.textContent = displayName;
}

export function restartGame() {
  const gameScreen = document.getElementById("gameScreen");
  const winnerScreen = document.getElementById("winnerScreen");
  const homePage = document.getElementById("homeScreen");

  gameScreen.classList.add("hidden");
  winnerScreen.classList.add("hidden");
  homePage.classList.remove("hidden");
}
