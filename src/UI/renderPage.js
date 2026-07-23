export function startGame() {
  const homePage = document.getElementById("homeScreen");
  const gameScreen = document.getElementById("gameScreen");

  homePage.classList.add("hidden");
  gameScreen.classList.remove("hidden");
}

export function renderGrid(gameState) {
  //destructure the gameState object
  const { player1Board, player2Board, currentPlayerId } = gameState;
  const player1Grid = document.getElementById("player1-grid");
  const player2Grid = document.getElementById("player2-grid");

  //reset the boards to avoid duplication
  player1Grid.replaceChildren();
  player2Grid.replaceChildren();

  const revealPlayer1sShips = currentPlayerId === "player1";
  const revealPlayer2sShips = currentPlayerId === "player2";

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
