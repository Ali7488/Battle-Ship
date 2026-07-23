import gameController from "../modules/gameController.js";
import {
  startGame,
  renderGrid,
  switchTurnScreen,
  displayWinner,
} from "./renderPage.js";

export default function initEventHandlers() {
  //get HTML elements
  const homeScreen = document.getElementById("homeScreen");
  const gameScreen = document.getElementById("gameScreen");
  const passBtn = document.getElementById("passPlayer");

  //Initialize gameController
  let activeController;
  let gameMode;

  //choosing the gamemode
  homeScreen.addEventListener("click", (event) => {
    const clickedBtn = event.target.closest(".homeScreenBtn");
    if (!clickedBtn) return;

    const btnAction = clickedBtn.dataset.action;

    if (btnAction === "computer") {
      activeController = gameController("computer");
      gameMode = "computer";
    } else if (btnAction === "human") {
      activeController = gameController("human");
      gameMode = "human";
    } else return;

    startGame();
    const gameState = activeController.getGameState();
    renderGrid(gameState);
  });

  gameScreen.addEventListener("click", (event) => {
    const clickedBtn = event.target.closest(".game-cell");
    if (!clickedBtn) return;

    const clickedGrid = clickedBtn.closest(".game-board");
    if (!clickedGrid) return;

    const clickedGridOwner = clickedGrid.dataset.player;
    const currentPlayer = activeController.getGameState().currentPlayerId;

    if (clickedGridOwner === currentPlayer) return;

    const row = Number(clickedBtn.dataset.row);
    const col = Number(clickedBtn.dataset.col);

    const { winner } = activeController.playTurn(row, col);
    if (winner !== null) {
      displayWinner(winner);
      return;
    }
    if (gameMode === "human") {
      switchTurnScreen();
    } else {
      const gameState = activeController.getGameState();
      renderGrid(gameState);
    }
  });

  passBtn.addEventListener("click", () => {
    switchTurnScreen();
    const gameState = activeController.getGameState();
    renderGrid(gameState);
  });
}
